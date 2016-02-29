package hhm.jquery;

public class Comment {

	
	
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	
	public String getComment_content() {
		return comment_content;
	}
	public void setComment_content(String commentContent) {
		comment_content = commentContent;
	}
	public String getComment_time() {
		return comment_time;
	}
	public void setComment_time(String commentTime) {
		comment_time = commentTime;
	}
	public String getUser_image() {
		return user_image;
	}
	public void setUser_image(String userImage) {
		user_image = userImage;
	}
	public String getComment_parent_id() {
		return comment_parent_id;
	}
	public void setComment_parent_id(String commentParentId) {
		comment_parent_id = commentParentId;
	}
	public int getComment_id() {
		return comment_id;
	}
	public void setComment_id(int comment_id) {
		this.comment_id = comment_id;
	}
	private int comment_id;
	private String username;
	public int getUser_id() {
		return user_id;
	}
	public void setUser_id(int userId) {
		user_id = userId;
	}
	private int user_id;
	private String comment_content;
	private String comment_time;
	private String user_image;
	private String comment_parent_id;
	
}
