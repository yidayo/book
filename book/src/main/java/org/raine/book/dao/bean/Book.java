package org.raine.book.dao.bean;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Book {
	@Id
	@GeneratedValue
	private int bookid;
	private String bookname;
	private int userid;
	private int groupnameid;//分类id
	private String introduce;
	private int lihui;//是否有立绘
	private int love;//收藏数
	private int comment;//评论数
	private int chapter;//章节数
	private String img;
	private int timeline;//是否有时间轴
	private int finish;//1已完结,0未完结
	public Book() {}
	public int getBookid() {
		return bookid;
	}
	public void setBookid(int bookid) {
		this.bookid = bookid;
	}
	public String getBookname() {
		return bookname;
	}
	public void setBookname(String bookname) {
		this.bookname = bookname;
	}
	public int getUserid() {
		return userid;
	}
	public void setUserid(int userid) {
		this.userid = userid;
	}
	public int getGroupnameid() {
		return groupnameid;
	}
	public void setGroupnameid(int groupnameid) {
		this.groupnameid = groupnameid;
	}
	public String getIntroduce() {
		return introduce;
	}
	public void setIntroduce(String introduce) {
		this.introduce = introduce;
	}
	public int getLihui() {
		return lihui;
	}
	public void setLihui(int lihui) {
		this.lihui = lihui;
	}
	public int getLove() {
		return love;
	}
	public void setLove(int love) {
		this.love = love;
	}
	public int getComment() {
		return comment;
	}
	public void setComment(int comment) {
		this.comment = comment;
	}
	public int getChapter() {
		return chapter;
	}
	public void setChapter(int chapter) {
		this.chapter = chapter;
	}
	public String getImg() {
		return img;
	}
	public void setImg(String img) {
		this.img = img;
	}
	public int getTimeline() {
		return timeline;
	}
	public void setTimeline(int timeline) {
		this.timeline = timeline;
	}
	public int getFinish() {
		return finish;
	}
	public void setFinish(int finish) {
		this.finish = finish;
	}
	@Override
	public String toString() {
		return "Book [bookid=" + bookid + ", bookname=" + bookname + ", userid=" + userid + ", groupnameid="
				+ groupnameid + ", introduce=" + introduce + ", lihui=" + lihui + ", love=" + love + ", comment="
				+ comment + ", chapter=" + chapter + ", img=" + img + ", timeline=" + timeline + ", finish=" + finish
				+ "]";
	}
}
