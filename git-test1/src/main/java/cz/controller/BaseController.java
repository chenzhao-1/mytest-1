package cz.controller;

import cz.service.BaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;

/**
 * 基础公共控制器层
 * 此时由于没有确定泛型T的具体类型，则此类无法直接实例化，所以不需要加实例化注解
 * @param <T> 描述具体封装类型的泛型
 */
//注意：BaseController不能添加@Controller注解，因为没有指定具体的类型，启动报错。
public class BaseController<T> {

    @Autowired
    private BaseService baseService;

    /**
     * 动态添加（根据具体的字段）
     * @param t 保存要添加数据的对象
     * @return 添加成功返回success，否则返回fail;异常返回error
     */
    @RequestMapping("add")
    @ResponseBody
    public String add(T t){
        try {
            return baseService.addT(t);
        } catch (Exception e) {
            e.printStackTrace();
            return "error";
        }
    }

    /**
     * 动态删除（根据具体的字段）
     * @param t 保存要添加数据的对象
     * @return 删除成功返回success，否则返回fail;异常返回error
     */
    @RequestMapping("remove")
    @ResponseBody
    public String remove(T t){
        try {
            return baseService.removeT(t);
        } catch (Exception e) {
            e.printStackTrace();
            return "error";
        }
    }

    /**
     * 动态修改（根据具体的字段）
     * @param t 保存要添加数据的对象
     * @return 修改成功返回success，否则返回fail;异常返回error
     */
    @RequestMapping("update")
    @ResponseBody
    public String update(T t){
        try {
            return baseService.updateT(t);
        } catch (Exception e) {
            e.printStackTrace();
            return "error";
        }
    }

    /**
     * 数据动态查询（根据具体的字段）
     * @param t 保存要查询数据（条件字段属性）的对象
     * @return 数据库查询到的信息集合；若找到状态码为0，否则状态码为200
     */
    @RequestMapping("select")
    @ResponseBody
    public Map<String,Object> select(T t){
        Map<String,Object> map = new HashMap<String, Object>();
        try {
            //执行业务层条件分页查询
            map = baseService.selectT(t);
            map.put("code",0); //加载成功
        } catch (Exception e) {
            e.printStackTrace();
            map.put("code",200); //加载失败
            map.put("msg","数据加载异常"); //异常页面提示
        }
        return map;
    }

    /**
     * 根据条件分页查询数据
     * @param page 当前页,此参数名字只能是page
     * @param limit 每一页显示的数据条数,此参数名字只能是limit
     * @param t 保存要查询数据（条件字段属性）的对象
     * @return 数据库查询到的信息集合；若找到状态码为0，否则状态码为200
     */
    @RequestMapping("selectPage")
    @ResponseBody
    public Map<String,Object> selectPage(Integer page, Integer limit, T t){
        //新建返回的数据的map集合
        Map<String,Object> map = new HashMap<String, Object>();
        try {
            //执行业务层条件分页查询
            map = baseService.selectPageT(page,limit,t);
            map.put("code",0); //加载成功
        } catch (Exception e) {
            e.printStackTrace();
            map.put("code",200); //加载失败
            map.put("msg","数据加载异常"); //异常页面提示
        }
        return map;
    }
}
