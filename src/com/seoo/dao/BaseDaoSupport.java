package com.seoo.dao;

import java.sql.SQLException;
import java.util.List;

import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.springframework.orm.hibernate3.HibernateCallback;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

public class BaseDaoSupport extends HibernateDaoSupport {
	
	/**
	 * 分页hql查询
	 * @param hql
	 * @param first
	 * @param end
	 * @param values
	 * @return
	 */
	public List<?> qryByHQLWithPage(final String hql,final int first,final int end,final Object...values){
		List<?> result = this.getHibernateTemplate().executeWithNativeSession(new HibernateCallback<List<?>>() {
			@Override
			public List<?> doInHibernate(Session session) throws HibernateException, SQLException {
				// TODO Auto-generated method stub
				Query queryObject = session.createQuery(hql);
				if (values != null) {
					for (int i = 0; i < values.length; ++i) {
						queryObject.setParameter(i, values[i]);
					}
				}
				if(first >= 0) queryObject.setFirstResult(first);
				if(end >= 0) queryObject.setMaxResults(end);
				return queryObject.list();
			}
		});
		return result;
	}
	
	/**
	 * 分页sql查询
	 * @param sql
	 * @param first
	 * @param end
	 * @param values
	 * @return
	 */
	public List<?> qryBySQLWithPage(final String sql,final int first,final int end,final Object...values){
		List<?> result = this.getHibernateTemplate().executeWithNativeSession(new HibernateCallback<List<?>>() {
			@Override
			public List<?> doInHibernate(Session session) throws HibernateException, SQLException {
				// TODO Auto-generated method stub
				SQLQuery sqlQuery = session.createSQLQuery(sql);
				//设置参数
				if(values != null){
					int index = 0;
					for(Object value : values){
						sqlQuery.setParameter(index,value);
						index++;
					}
				}
				//分页设置
				if(first >= 0)sqlQuery.setFirstResult(first);
				if(end >= 0)sqlQuery.setMaxResults(end);
				return sqlQuery.list();
			}
		});
		return result;
	}
}
