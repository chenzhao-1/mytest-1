layui.use(['jquery','layer', 'table','form','laydate'], function() {
    var $ = layui.jquery    //引入jquery模块
        , layer = layui.layer  //引用layer弹出层模块
        , table = layui.table  //引用table数据表格模块
        , form = layui.form  //引用form表单模块
        , laydate = layui.laydate;  //引用日期模块

    //执行一个laydate实例
    laydate.render({
        elem: '#createDate' //指定元素的id
        ,type:'datetime'  //日期格式
        ,format:'yyyy/MM/dd HH:mm:ss'  //日期字符串格式
        ,value:new Date()  //初始值为系统当前时间
        ,min:0  //表示只能选则当前数据之后的时间
    });

    //加载可用的客房信息
    loadRoomsByRoomStatus("0");

    //加载可用的客房信息
    function loadRoomsByRoomStatus(roomStatus) {
        $.post(
            "/Rooms/loadAll", //请求的url路径 ，使用base中方法
            {"roomStatus": roomStatus}, //数据
            function (data) {
                console.log("data:", data);
                var roomStr = "<option value=''>---请选择客房类型---</option>";
                $.each(data, function (i, room) {
                    roomStr += `<option value="${room.id}">${room.roomNum} - ${room.roomType.roomTypeName} - ${room.roomType.roomPrice}¥</option>`;
                })
                $("#selRoomNumId").html(roomStr);
                form.render("select"); //渲染
            }, "json"
        ).error(function () {
            layer.msg("数据请求异常！", {icon: 7, time: 2000, anim: 3, shade: 0.5});
        })
    }

    //选择会员和非会员时的radio单选触发
    form.on('radio(isVip)', function(data){
        console.log(data.elem); //得到radio原始DOM对象
        console.log(data.value); //被点击的radio的value值
        $("form").eq(0).find('input:text').val("");  //清空表单之前的数据
        data.value == '1'?isVipTrue():isVipFalse()
    });

    /*************************自定义绑定事件*************************/
    //给会员卡号输入框失去焦点事件
    $("#vipNum").blur(function () {
        //失去焦点时会有卡号验证
        var vipNum = $(this).val();
        //验证会员卡号的格式
        if((/(^[1-9]\d*$)/.test(vipNum))){
            if(vipNum.length==16){  //验证长度
                //发送ajax请求，查询会员卡号
                loadVipByVipNum(vipNum);  //根据会员卡号加载单个会员数据
            }else {
                //吸附框  会员卡号长度必须位16位：提示内容  ，#vip_num吸附的标签
                //{tips: [2,'green'],time:2000}  弹出位置（上右下左1-4）   背景颜色  显示时间
                layer.tips('会员卡号长度必须位16位','#vipNum', {tips: [2,'red'],time:2000});
            }
        }else {
            layer.tips('会员卡号必须为正整数','#vipNum', {tips: [2,'red'],time:2000});
        }
    });

    /*************************自定义函数****************************/
    //是会员的表单操作
    function isVipTrue() {
        $("#vipNum").removeAttr("disabled")  //将会员卡号输入框可用
        $("#vipNum").attr("lay-verify","required|number|vipNum"); //添加验证的属性值
        //将客人姓名，手机号，身份证号，性别均不可用
        $("#customerName").attr("disabled","disabled");
        $("input[name=gender]").attr("disabled","disabled");
        $("#idcard").attr("disabled","disabled");
        $("#phone").attr("disabled","disabled");
    }
    //非会员的表单操作
    function isVipFalse() {
        $("#vipNum").attr("disabled","disabled"); //将会员卡号输入框不可用
        $("#vipNum").removeAttr("lay-verify")  //移除验证的属性值
        //将客人姓名，手机号，身份证号，性别均可用
        $("#customerName").removeAttr("disabled");
        $("input[name=gender]").removeAttr("disabled");
        $("#idcard").removeAttr("disabled");
        $("#phone").removeAttr("disabled");
    }

    //发送ajax请求，查询会员卡号
    function loadVipByVipNum(vipNum){
        $.post(
            "/Vip/loadTByParams", //请求的url路径 ，使用base中方法
            {"vipNum":vipNum}, //数据
            function (data){
                console.log("data:",data);
                //data是json对象
                //判断data是否为空
                if(!$.isEmptyObject(data)){
                    //表单数据的回显
                    //给表单赋值
                    form.val("addInRoomInfoFormFilter", { //formTest 即 class="layui-form" 所在元素属性 lay-filter="" 对应的值
                        "customerName": data.customerName // "name": "value"
                        ,"gender": data.gender
                        ,"idcard": data.idcard
                        ,"phone": data.phone
                    });
                    layer.tips('已查询出此会员数据','#vipNum', {tips: [2,'green'],time:2000});
                }else{
                    layer.tips('没有此会员数据','#vipNum', {tips: [2,'red'],time:2000});
                }
            },"json"
        ).error(function (){
            layer.msg("数据请求异常！",{icon: 7,time:2000,anim: 3,shade:0.5});
        })
    }

    //自定义验证
    form.verify({  //做表单提交时的验证
        money:function (value) { //value：表单的值、item：表单的DOM对象
            if(value<100 || value>2000){
                return '押金范围在100-2000元之内';
            }
        }
    });

    //提交添加入住信息的表单
    form.on('submit(addInRoomInfoSure)', function(data){
        console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
        var addJsonInRoomInfo = data.field;
        /*设置入住信息的状态和显示状态*/
        addJsonInRoomInfo['outRoomStatus'] = '0';
        addJsonInRoomInfo['status'] = '1';
        //发送服务端请求，添加入住信息
        addInRoomInfo(addJsonInRoomInfo);
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    //发送服务端请求，添加入住信息
    function addInRoomInfo(addJsonInRoomInfo){
        $.post(
            "/InRoomInfo/add", //请求的url路径
            addJsonInRoomInfo,
            function (data){
                if(data === 'success'){
                    layer.msg("入住信息添加成功！",{icon: 1,time:2000,anim: 1,shade:0.5});
                    /*实现2秒之后，跳转到入住信息显示页面 ： 定时器: setInterval()  setTimeOut() */
                    setTimeout("window.location.href='Model/toShowInRoomInfo'",2000);
                }else{
                    layer.msg("入住信息添加失败！",{icon: 2,time:2000,anim: 2,shade:0.5});
                }
            },"text" //text : 表示后端响应的是文本
        ).error(function (){
            layer.msg("数据请求异常！",{icon: 7,time:2000,anim: 3,shade:0.5});
        })
    }
})