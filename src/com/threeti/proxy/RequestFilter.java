/**
 * 微信公众平台开发模式(JAVA) SDK
 * (c) 2012-2013 ____′↘夏悸 <wmails@126.cn>, MIT Licensed
 * http://www.jeasyuicn.com/wechat
 */
package com.threeti.proxy;

import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Enumeration;
import java.util.Properties;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.apache.log4j.Logger;

/**
 * 请求拦截
 * 
 * @author GodSon
 * 
 */
public class RequestFilter implements Filter {

	private final Logger logger = Logger.getLogger(RequestFilter.class);

	private String baseURL;

	
	public void destroy() {
		logger.info("Filter已经销毁");
	}


	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
		HttpServletRequest request = (HttpServletRequest) req;
		HttpServletResponse response = (HttpServletResponse) res;

		String path = request.getServletPath();
		String pathInfo = path.substring(path.lastIndexOf("/"));

		if (pathInfo == null) {
			response.getWriter().write("error");
		} else {
			if (path.contains("/proxy")) {
				pathInfo = path.substring(path.lastIndexOf("/proxy") + 6);
				if ("POST".equals(request.getMethod())) { // POST请求
					String urlString = this.baseURL + pathInfo;
					logger.info(urlString);
					String s = this.getParams(req).substring(0,this.getParams(req).length() -1);
					byte[] data = s.getBytes("utf-8");
					HttpURLConnection conn = null;
					DataOutputStream outStream = null;
					URL httpUrl = new URL(urlString);
					conn = (HttpURLConnection) httpUrl.openConnection();
					conn.setConnectTimeout(7000);
					conn.setReadTimeout(7000);
					conn.setUseCaches(false);
					conn.setDoOutput(true);
					conn.setRequestMethod("POST");
					conn.setRequestProperty("Connection", "Keep-Alive");
					conn.setRequestProperty("Charset", "utf-8");
					conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
					conn.setRequestProperty("Content-Length", String.valueOf(data.length));
					outStream = new DataOutputStream(conn.getOutputStream());
					outStream.write(data);
					outStream.flush();
					if (conn.getResponseCode() == 200) {
						InputStream in = conn.getInputStream();
						IOUtils.copy(in, response.getOutputStream());
					} else {
						try {
							throw new Exception("ResponseCode=" + conn.getResponseCode());
						} catch (Exception e) {
							e.printStackTrace();
						}
					}
					
				} else if("DELETE".equals(request.getMethod())) {
					String urlString = this.baseURL + pathInfo + "?" + this.getParams(req);
					logger.info(urlString);
					HttpURLConnection conn = null;
					URL url = new URL(urlString);
					conn = (HttpURLConnection) url.openConnection();
					conn.setConnectTimeout(7000);
					conn.setReadTimeout(7000);
					conn.setUseCaches(false);
					conn.setDoOutput(true);
					conn.setRequestMethod("DELETE");
					if (conn.getResponseCode() == 200) {
						InputStream in = conn.getInputStream();
						IOUtils.copy(in, response.getOutputStream());
					} else {
						try {
							throw new Exception("ResponseCode=" + conn.getResponseCode());
						} catch (Exception e) {
							e.printStackTrace();
						}
					}
				} else {
					String urlString = this.baseURL + pathInfo + "?" + this.getParams(req);
					logger.info(urlString);
					URL url = new URL(urlString);
					InputStream input = url.openStream();
					IOUtils.copy(input, response.getOutputStream());
				}
			} else {
				chain.doFilter(req, res);
			}
		}
	}

	/**
	 * 启动的时候加载config.properties配置 可以在过滤器配置config.properties路径
	 */

	public void init(FilterConfig config) throws ServletException {
		InputStream inputStream = this.getClass().getClassLoader().getResourceAsStream("config.properties");
		Properties p = new Properties();
		try {
			p.load(inputStream);
			this.baseURL = p.getProperty("baseUrl");
			logger.info("Filter已经启动！");
		} catch (IOException e1) {
			e1.printStackTrace();
		}

	}

	private String getParams(ServletRequest req) {
		StringBuffer params = new StringBuffer();
		Enumeration<String> keys = req.getParameterNames();
		while (keys.hasMoreElements()) {
			String key = keys.nextElement();
			try {
				// params.append(key).append("=").append(URLEncoder.encode(req.getParameter(key), "UTF-8")).append("&");
				params.append(key).append("=").append(req.getParameter(key)).append("&");
//				if("".equals(req.getParameter(key))){
//					params.append(key);
//				}else{
//					
//				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		System.out.println(params.toString());
		return params.toString();
	}

}
