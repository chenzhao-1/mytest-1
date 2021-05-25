package cz.dao;

import java.util.List;

/**
 * 基础公共Mapper代理对象
 * @param <T> 描述具体封装类型的泛型
 */
public interface BaseMapper<T> {

    /**
     * 动态添加（根据具体的字段）
     * @param t 保存要添加数据的对象
     * @return 数据库受影响的行数
     * @throws Exception
     */
    Integer insertOptional(T t) throws Exception;

    /**
     * 动态删除（根据具体的字段）
     * @param t 保存删除条件（字段属性）的对象
     * @return 数据库受影响的行数
     * @throws Exception
     */
    Integer deleteOptional(T t) throws Exception;

    /**
     * 动态修改（根据具体的字段）
     * @param t 保存要修改数据（改变后的字段属性和唯一主键信息）的对象
     * @return 数据库受影响的行数
     * @throws Exception
     */
    Integer updateOptional(T t) throws Exception;

    /**
     * 单条数据动态查询（根据具体的字段）
     * @param t 保存要查询数据（条件字段属性）的对象
     * @return 数据库查询到的信息对象，若没有找到则抛出异常
     * @throws Exception
     */
    //T selectOptional(T t) throws Exception;

    /**
     * 多条件分页查询（根据具体的字段）
     * @param t 保存要查询数据（条件字段属性）的对象
     * @return 数据库查询到的信息对象集合
     * @throws Exception
     */
    List<T> selectOptional(T t) throws Exception;
}
