package cz.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import cz.dao.BaseMapper;
import cz.service.BaseService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 基础公共业务层实现类
 * 此时由于没有确定泛型T的具体类型，则此类无法直接实例化，所以不需要加实例化注解
 * @param <T> 描述具体封装类型的泛型
 */
//注意：BaseServiceImpl不能添加@Service注解，因为没有指定具体的实现类型，启动报错。
public class BaseServiceImpl<T> implements BaseService<T> {

    @Autowired
    private BaseMapper<T> baseMapper;//注入基础的BaseMapper代理对象

    /**
     * 动态添加（根据具体的字段）
     * @param t 保存要添加数据的对象
     * @return 添加成功返回success，否则返回fail
     * @throws Exception
     */
    @Override
    public String addT(T t) throws Exception {
        return baseMapper.insertOptional(t)>0? "success":"fail";
    }

    /**
     * 动态删除（根据具体的字段）
     * @param t 保存删除条件（字段属性）的对象
     * @return 删除成功返回success，否则返回fail
     * @throws Exception
     */
    @Override
    public String removeT(T t) throws Exception {
        return baseMapper.deleteOptional(t)>0? "success":"fail";
    }

    /**
     * 动态修改（根据具体的字段）
     * @param t 保存要修改数据（改变后的字段属性和唯一主键信息）的对象
     * @return 修改成功返回success，否则返回fail
     * @throws Exception
     */
    @Override
    public String updateT(T t) throws Exception {
        return baseMapper.updateOptional(t)>0? "success":"fail";
    }

    /**
     * 数据动态查询（根据具体的字段）
     * @param t 保存要查询数据（条件字段属性）的对象
     * @return 数据库查询到的信息集合，若没有找到则抛出异常
     * @throws Exception
     */
    @Override
    public Map<String,Object> selectT(T t) throws Exception {
        Map<String,Object> map=new HashMap<String, Object>();
        List<T> list=baseMapper.selectOptional(t);
        map.put("count",list.size()); //装总的数据条数 key值为："count" 千万不要改(layui框架)
        map.put("data",list); //装分页的对象数据 key值为："data" 千万不要改(layui框架)
        return map;
    }

    /**
     * 多条件分页查询（根据具体的字段）
     * @param page 当前页
     * @param limit 每一页的数据条数
     * @param t 保存要查询数据（条件字段属性）的对象
     * @return 分页查询到的对象数据
     * @throws Exception
     */
    @Override
    public Map<String,Object> selectPageT(Integer page, Integer limit, T t) throws Exception {
        Map<String,Object> map = new HashMap<String, Object>();//新建分页的map集合对象

        PageHelper.startPage(page,limit);//开启分页

        PageInfo<T> pageInfo = new PageInfo<T>(baseMapper.selectOptional(t));//进行分页查询

        //往map集合中装入相关数据
        map.put("count",pageInfo.getTotal()); //装总的数据条数 key值为："count" 千万不要改(layui框架)
        map.put("data",pageInfo.getList()); //装分页的对象数据 key值为："data" 千万不要改(layui框架)

        return map;
    }
}
