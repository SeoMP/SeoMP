package com.seoo.servlet.filter;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.alibaba.fastjson.JSONObject;
import com.seoo.pojo.TblCommonUser;

/**
 * Servlet Filter implementation class SessionOvertimeCheckFilter
 */
public class SessionLiveCheckFilter extends OncePerRequestFilter {
     /*private static final String[] FILTERREQUESTTYPES = 
    	 {".css",".ico",".js",".gif",".html",".png",".jpg",".bmp",".jpeg"};*/
    /**
     * @see OncePerRequestFilter#OncePerRequestFilter()
     */
    public SessionLiveCheckFilter() {
        super();
        // TODO Auto-generated constructor stub
    }

	
	@Override
	protected void doFilterInternal(HttpServletRequest request,
			HttpServletResponse response, FilterChain paramFilterChain)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		String uri = request.getRequestURI();
		/*if(contains(uri))return;*/
		if(!uri.contains(".action") || uri.contains("LoginInDeal") || uri.contains("LoginOutDeal")){
			paramFilterChain.doFilter(request, response);
			return;
		}
		HttpSession session = request.getSession(false);
		if(session != null){
			TblCommonUser user = (TblCommonUser)session.getAttribute("loginInfo");
			if(user != null && StringUtils.isNotBlank(user.getaLoginId())){
				paramFilterChain.doFilter(request, response);
				return;
			}
		}
		response.setContentType("text/html");
		response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);//500错误
		JSONObject msg = new JSONObject();
		msg.put("ECODE","SESSION_INVALID");
		msg.put("EMSG","会话失效/操作员信息失效，请重新登录！");
		String encoding = StringUtils.isBlank(response.getCharacterEncoding())?"UTF-8":response.getCharacterEncoding();
		IOUtils.write(msg.toJSONString(), response.getOutputStream(),encoding);
		response.getOutputStream().close();
	}
}
