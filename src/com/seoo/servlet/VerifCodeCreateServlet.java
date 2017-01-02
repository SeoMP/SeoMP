package com.seoo.servlet;



import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.Random;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;

/**
 * Servlet implementation class ImageCreateServlet
 */
public class VerifCodeCreateServlet extends HttpServlet {
	private static final Logger log = Logger.getLogger(VerifCodeCreateServlet.class);
	private static final long serialVersionUID = 1L;
    private static final int IMAGEWIDTH = 88;
    private static final int IMAGEHEIGHT = 30; 
    private static final int CODELEN = 4;
    /**
     * @see HttpServlet#HttpServlet()
     */
    public VerifCodeCreateServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doPost(request,response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.setContentType("image/jpeg");
		String verifiCode = "";
		BufferedImage bufImage = new BufferedImage(IMAGEWIDTH,IMAGEHEIGHT,BufferedImage.TYPE_INT_BGR);
		Graphics graphics = bufImage.getGraphics();//得到画布对象
		//绘制一个矩形，淡蓝色
		graphics.setColor(new Color(162,209,255));
		graphics.fillRect(0, 0, IMAGEWIDTH, IMAGEHEIGHT);
		//绘制验证码，蓝色，字体粗体，斜体
		graphics.setColor(new Color(0,0,192));
		for(int i=0;i<CODELEN;i++){
			String eachCode = getVerifiCode();
			verifiCode += eachCode;
			graphics.setFont(getRandomStyle());
			graphics.drawString(eachCode, 5+20*i, 23);	
		}
		//填充直线
		graphics.setColor(new Color(42,104,78));
		for(int i=1;i<=7;i++){
			graphics.drawLine(0, 4*i, IMAGEWIDTH, 4*i);
		}
		HttpSession session = request.getSession();
		session.setAttribute("verifiCode", verifiCode);
		if(log.isInfoEnabled())log.info("验证码====="+verifiCode);
		graphics.dispose();//释放此图形的上下文以及它使用的所有系统资源
		ImageIO.write(bufImage, "jpg", response.getOutputStream());//将图像资源放入响应中，输出到客户端
	}
	
	private Font getRandomStyle(){
		Random random = new Random();
		String[] styles = {"Courier Bold Italic","Arial Bold","Arial Black","微软雅黑","宋体"};
		Font font = new Font(styles[random.nextInt(5)],Font.ITALIC,25);
		return font;
	}
	
	private String getVerifiCode(){
		String[] letterUs = {"a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q",
						"r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J",
						"K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"};
		int[] nums = {0,1,2,3,4,5,6,7,8,9};
		Random random = new Random();
		String[] verifiCodes = new String[CODELEN];
		verifiCodes[0] = letterUs[random.nextInt(letterUs.length)];
		verifiCodes[1] = letterUs[random.nextInt(letterUs.length)];
		verifiCodes[2] = nums[random.nextInt(nums.length)]+"";
		verifiCodes[3] = nums[random.nextInt(nums.length)]+"";
		return verifiCodes[random.nextInt(CODELEN)];
	}
}
