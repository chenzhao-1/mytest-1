layui.use(['jquery','layer', 'table','form','laydate'], function() {
    var $ = layui.jquery    //引入jquery模块
        , layer = layui.layer  //引用layer弹出层模块
        , table = layui.table  //引用table数据表格模块
        , form = layui.form  //引用form表单模块
        , laydate = layui.laydate;  //引用日期模块

    var currentPage = 1; //创建全局变量，指定当前页是第1页

    var selJSONOrders = {}; //封装了全局变量。json格式的查询条件 {}:表示空的json对象

    loadOrders();

    //日期时间范围选择
    laydate.render({
        elem: '#timeLimit'
        ,type: 'datetime'
        ,format: 'yyyy/MM/dd HH:mm:ss'
        ,range: true //或 range: '~' 来自定义分割字符
    });

    //查询条件的表单提交
    form.on('submit(searchOrders)',function (data){
        console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
        //把查询条件的值赋值给selJSONOrders
        selJSONOrders = data.field;
        //先处理日期
        if(data.field.queryTimes!=''){
            var arrTimes = data.field.queryTimes.split("-");
            //起始时间
            selJSONOrders['minDate'] = arrTimes[0];
            //结束时间
            selJSONOrders['maxDate'] = arrTimes[1];
        }
        selJSONOrders['orderNum'] = data.field.orderNum;
        selJSONOrders['orderStatus'] = data.field.orderStatus;
        //调用查询员工的函数
        loadOrders()
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    })

    /**********************自定义的layui函数*************************/
    //封装了查询入住信息的函数
    function loadOrders(){
        //第一个实例
        table.render({
            elem: '#Orders'  //表示跟表格容器的id进行绑定
            ,height: 500 //表格容器的高度
            //  默认会自动传递两个参数：?page=1&limit=30  page 代表当前页码、limit 代表每页数据量
            ,toolbar: '#toolbarOrders' //开启头部工具栏，并为其绑定左侧模板
            ,defaultToolbar: ['filter', 'exports', 'print', { //自定义头部工具栏右侧图标。如无需自定义，去除该参数即可
                title: '提示'
                ,layEvent: 'LAYTABLE_TIPS'
                ,icon: 'layui-icon-tips'}]
            ,url: 'Orders/loadPageByParams' //数据接口, 用来访问到后端控制器中，获取数据返回 （JSON数据）
            ,page: true //开启分页
            ,width: 1600 //设定容器宽度。
            ,limits: [3,5,8,10,15,20] //自定义分页条数
            ,limit: 3  //默认每页显示3条记录
            ,where: selJSONOrders   //where : 表示查询条件,layui会把该查询条件传递到后端控制器
            ,even: true  //隔行变色效果
            ,cols: [[ //表头
                /*开启复选框*/
                {type:'checkbox', fixed: 'left'}
                    , {field: 'id', title: 'ID', align: 'center', width: 80, sort: true}
                    , {field: 'orderNum', title: '订单编号' , align: 'center', width: 180}
                    , {field: 'customerName', title: '客人姓名', align: 'center', width: 140, sort: true,
                        templet: '<div>{{d.inRoomInfo.customerName}}</div>'}
                    , {field: 'idcard', title: '身份证号', align: 'center', width: 210,
                        templet: '<div>{{d.inRoomInfo.idcard}}</div>'}
                    , {field: 'isVip', title: 'vip', align: 'center', width: 100,
                        templet: '#isVipTpl'}
                    , {field: 'phone', title: '手机号', align: 'center', width: 180, sort: true,
                        templet: '<div>{{d.inRoomInfo.phone}}</div>'}
                    , {field: 'createDate', title: '下单时间', align: 'center', width: 240, sort: true}
                    , {field: 'orderMoney', title: '总价',align: 'center', width: 140, sort: true}
                    , {field: 'remark', title: '备注',align: 'center', width: 280, sort: true}
                    , {field: 'orderStatus', title: '状态',align: 'center', width: 120, sort: true,
                        templet:'#orderStatusTpl'}
                    , {title: '操作', align: 'center', toolbar: '#barOrders',fixed:'right', width: 180}
                ]]
            /*渲染完毕之后的回调函数*/
            ,done: function(res, curr, count){
                //得到当前页码
                console.log(curr);
                //给currentPage赋值
                currentPage = curr;
            }
        });
    }

    //头工具栏事件
    table.on('toolbar(Orders)', function(obj){
        var checkStatus = table.checkStatus(obj.config.id);
        switch(obj.event){
            case 'getCheckData':
                var data = checkStatus.data;
                layer.alert(JSON.stringify(data));
                break;
            case 'getCheckLength':
                var data = checkStatus.data;
                layer.msg('选中了：'+ data.length + ' 个');
                break;
            case 'isAll':
                layer.msg(checkStatus.isAll ? '全选': '未全选')
                break;
            case 'delSelected'://批量删除
                console.log(checkStatus.data) // 获取选中行的数据
                console.log(checkStatus.data.length) // 获取选中行数量，可作为是否有选中行的条件
                console.log(checkStatus.isAll ) // 表格是否全选

                var arrOrders = checkStatus.data;//将数据以数组形式保存

                //获取选中行数量，可作为是否有选中行的条件
                if(arrOrders.length == 0){
                    return layer.msg("请选择需要删除的数据",{icon: 7,time:2000,anim: 6,shade:0.5});
                }
                //询问是否删除
                layer.confirm('真的批量删除员工数据么?', function(index) {
                    //定义员工编号的字符串
                    var ids = '';
                    //通过循环获取多个员工编号拼接在字符串中
                    for (let i = 0; i < arrOrders.length; i++) {
                        ids += arrOrders[i].id + ","; //拼接字符串
                    }
                    //去掉字符串最后的,号
                    // 那么springmvc会自动把该字符串转换为字符数组
                    // 1733,1788,1766 -> [1733,1788,1766]
                    ids = ids.substring(0,ids.length - 1);
                    console.log(ids);
                    //向服务端发送批量删除指令
                    deleteOrdersByKeys(ids);
                    layer.close(index); //关闭当前弹框
                });
                break;
        };
    });

    //工具条事件
    table.on('tool(Orders)', function(obj){ //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前从后端服务器返回的data数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        var tr = obj.tr; //获得当前行 tr 的 DOM 对象（如果有的话）

        console.log(data);

        switch (layEvent) {
            case 'del'://删除
                layer.confirm('真的删除订单数据么？', function(index) {
                    //向服务端发送订单删除指令（更新flag字段）
                    deleteOrdersByKeys(data.id, obj);
                    layer.close(index);
                });
                break;
            case 'payUI':
                layer.msg("支付操作...");
                break;
        }
    });

    //根据员工编号批量删除数据
    function deleteOrdersByKeys(ids){
        $.post(
            "/Orders/updByPrimaryKeySelective",//异步请求前往控制器
            {"ids":ids,"flag":"0"},//传递json数据到后台
            function (data){
                console.log(data);
                if(data === 'success'){
                    layer.msg("删除成功！",{icon: 1,time:2000,anim: 4,shade:0.5});
                    //重新渲染当前页的表格数据
                    table.reload('Orders', {//demo为table表格容器id
                        page: {
                            curr: currentPage //重新从第 currentPage(当前页) 页开始
                        }
                    }); //只重载数据
                }else {
                    layer.msg("删除失败！",{icon: 2,time:2000,anim: 4,shade:0.5});
                }
            },"text"
        ).error(function (){
            layer.msg("服务器异常！！！",{icon: 3,time:2000,anim: 6,shade:0.5});
        })
    }
})