package cz.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("Model")
public class ModelController {
    //去到管理平台首页
    @RequestMapping("toHome")
    public String toHome(){
        return "home";
    }

    //跳转到入住信息查询页面
    @RequestMapping("toShowInRoomInfo")
    public String toShowInRoomInfo(){
        /*这里必须要添加对应的文件夹路径*/
        return "inRoomInfo/showInRoomInfo";
    }
}
