package cz.service;


import java.util.List;
import java.util.Map;

/**
 * 基础公共的业务层接口
 * @param <T> 描述具体封装类型的泛型
 */
public interface BaseService<T> {

    /**
     * 动态添加（根据具体的字段）
     * @param t 保存要添加数据的对象
     * @return 添加成功返回success，否则返回fail
     * @throws Exception
     */
    String addT(T t) throws Exception;

    /**
     * 动态删除（根据具体的字段）
     * @param t 保存删除条件（字段属性）的对象
     * @return 删除成功返回success，否则返回fail
     * @throws Exception
     */
    String removeT(T t) throws Exception;

    /**
     * 动态修改（根据具体的字段）
     * @param t 保存要修改数据（改变后的字段属性和唯一主键信息）的对象
     * @return 修改成功返回success，否则返回fail
     * @throws Exception
     */
    String updateT(T t) throws Exception;

    /**
     * 单条数据动态查询（根据具体的字段）
     * @param t 保存要查询数据（条件字段属性）的对象
     * @return 数据库查询到的信息对象，若没有找到则抛出异常
     * @throws Exception
     */
    Map<String,Object> selectT(T t) throws Exception;

    /**
     * 多条件分页查询（根据具体的字段）
     * @param page 当前页
     * @param limit 每一页的数据条数
     * @param t 保存要查询数据（条件字段属性）的对象
     * @return 分页查询到的对象数据
     * @throws Exception
     */
    Map<String,Object> selectPageT(Integer page, Integer limit, T t) throws Exception;
}
