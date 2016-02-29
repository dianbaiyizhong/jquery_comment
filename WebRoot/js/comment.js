(function($) {

	$.fn.comment = function(para) {
		// 这个self代表当前的引用对象，如<div id="Comment"><div>这个对象
		var self = this;

		// 获取url得到的json数据
		var url = para.agoComment;
		$.getJSON(url, {
			goods_id : "1",
			current_page : "1",
			page_size : "10"
		}, function(data) {

			// 获取了json,在这里进行操作
			createAgoCommentHtml(data); // 创建以往评论的html

		});

		// 创建以往评论
		function createAgoCommentHtml(comment) {

			var html = '';
			html += '<div id="commentItems">';
			html += '	<div> 大家的脚印 </div>';
			html += '</div>';
			$(self).append(html);

			// 这里是循环
			for (var i = 0; i < comment.length; i++) {

				var item = '';
				item += '<div id="comment' + comment[i].comment_id
						+ '" class="comment">';
				item += '	<a class="username">';
				item += '		<img src="images/foot.png">';
				item += '	</a>';
				item += '	<div class="content">';
				item += '		<a class="username"> ' + comment[i].username
						+ ' </a>';
				item += '			<span class="comment_time"> '
						+ comment[i].comment_time + ' </span>';
				item += '		<div class="comment_content"> '
						+ comment[i].comment_content + ' </div>';
				item += '		<div class="actions">';
				item += '			<a class="reply" href="javascript:void(0)" selfID="'
						+ comment[i].comment_id + '" >回复</a>';
				item += '		</div>';
				item += '	</div>';
				item += '	</div>';

				// 判断此条评论是不是子级评论
				if (comment[i].comment_parent_id == 0) { // 不是
					$("#commentItems").append(item);
				} else { // 否
					// 判断父级评论下是不是已经有了子级评论
					if ($("#comment" + comment[i].comment_parent_id).find(
							".comments").length == 0) { // 没有
						var comments = '';
						comments += '<div id="comments'
								+ comment[i].comment_parent_id
								+ '" class="comments">';
						comments += item;
						comments += '</div>';

						$("#comment" + comment[i].comment_parent_id).append(
								comments);
					} else { // 有
						$("#comments" + comment[i].comment_parent_id).append(
								item);
					}
				}

			}

			createFormCommentHtml();// 创建以往评论的html

		}

		// 创建以往评论的html
		function createFormCommentHtml() {

			// 先添加父容器
			$(self).append('<div id="commentFrom"></div>');

			// 组织发表评论的form html代码
			var boxHtml = '';
			boxHtml += '<form id="replyBoxAri" class="ui reply form">';
			boxHtml += '	<div class="ui large form ">';
			boxHtml += '		<div class="contentField field" >';
			boxHtml += '			<textarea id="commentContent"></textarea>';
			boxHtml += '			<label class="commentContentLabel" for="commentContent">Content</label>';
			boxHtml += '		</div>';
			boxHtml += '		<div id="submitComment" class="ui button teal submit labeled icon">';
			boxHtml += '			<i class="icon edit"></i> 提交评论';
			boxHtml += '		</div>';
			boxHtml += '	</div>';
			boxHtml += '</form>';

			$("#commentFrom").append(boxHtml);

			// 初始化html之后绑定点击事件
			addEvent();

		}

		/**
		 * 功能：绑定事件 参数: 无 返回: 无
		 */
		function addEvent() {

			// 绑定item上的回复事件
			replyClickEvent();

			// 绑定item上的取消回复事件
			cancelReplyClickEvent();

			// 绑定回复框的事件
			addFormEvent();
		}

		function replyClickEvent() {

			// 绑定回复按钮点击事件
			$(self).find(".actions .reply")
					.live("click",function() {
								// 设置当前回复的评论的id
								fCode = $(this).attr("selfid");
								// 1.移除之前的取消回复按钮
								$(self).find(".cancel").remove();
								// 2.移除所有回复框
								removeAllCommentFrom();
								// 3.添加取消回复按钮
								$(this).parent(".actions").append(
												'<a class="cancel" href="javascript:void(0)">取消回复</a>');
								// 4.添加回复下的回复框
								addReplyCommentFrom($(this).attr("selfID"));
								// 绑定提交事件
								$("#publicComment").die("click");
								$("#publicComment").live("click", function() {
									var result = {
										"name" : $("#userName").val(),
										"email" : $("#userEmail").val(),
										"content" : $("#commentContent").val()
									};
									para.callback(result);
								});
							});

		}

		// 移除所有回复框
		function removeAllCommentFrom() {
			// 移除评论下的回复框
			if ($(self).find("#replyBox")[0]) {
				// 删除评论回复框
				$(self).find("#replyBox").remove();
			}

			// 删除文章回复框
			if ($(self).find("#replyBoxAri")[0]) {
				$(self).find("#replyBoxAri").remove();
			}
		}

		// 添加回复下的回复框
		function addReplyCommentFrom(id) {
			var boxHtml = '';
			boxHtml += '<form id="replyBox" class="ui reply form">';
			boxHtml += '	<div class="ui  form ">';
			boxHtml += '		<div class="contentField field" >';
			boxHtml += '			<textarea id="commentContent"></textarea>';
			boxHtml += '			<label class="commentContentLabel" for="commentContent">Content</label>';
			boxHtml += '		</div>';
			boxHtml += '		<div id="publicComment" class="ui button teal submit labeled icon">';
			boxHtml += '			<i class="icon edit"></i> 提交评论';
			boxHtml += '		</div>';
			boxHtml += '	</div>';
			boxHtml += '</form>';

			$(self).find("#comment" + id).find(">.content").after(boxHtml);

		}

		/**
		 * 功能: 绑定item上的取消回复事件 参数: 无 返回: 无
		 */
		function cancelReplyClickEvent() {
			$(self).find(".actions .cancel").die("click");
			$(self).find(".actions .cancel").live("click", function() {
				// 1.移除之前的取消回复按钮
				$(self).find(".cancel").remove();

				// 2.移除所有回复框
				removeAllCommentFrom();

				// 3.添加根下的回复框
				addRootCommentFrom();
			});
		}

		
		

		// 添加新评论的内容
		function addNewComment(param) {

			var item = '';
			item += '<div id="comment' + comment[i].comment_id
					+ '" class="comment">';
			item += '	<a class="username">';
			item += '		<img src="images/foot.png">';
			item += '	</a>';
			item += '	<div class="content">';
			item += '		<a class="username"> ' + comment[i].username + ' </a>';
			item += '			<span class="comment_time"> ' + comment[i].comment_time
					+ ' </span>';
			item += '		<div class="comment_content"> '
					+ comment[i].comment_content + ' </div>';
			item += '		<div class="actions">';
			item += '			<a class="reply" href="javascript:void(0)" selfID="'
					+ comment[i].comment_id + '" >回复</a>';
			item += '		</div>';
			item += '	</div>';
			item += '	</div>';

			if (parseInt(fCode) == 0) { // 如果对根添加
				$("#commentItems").append(item);
			} else {
				// 判断父级评论下是不是已经有了子级评论
				if ($("#comment" + fCode).find(".comments").length == 0) { // 没有
					var comments = '';
					comments += '<div id="comments' + fCode
							+ '" class="comments">';
					comments += item;
					comments += '</div>';

					$("#comment" + fCode).append(comments);
				} else { // 有
					$("#comments" + fCode).append(item);
				}
			}
		}

		// 添加根下的回复框
		function addRootCommentFrom() {
			var boxHtml = '';
			boxHtml += '<form id="replyBoxAri" class="ui reply form">';
			boxHtml += '	<div class="ui large form ">';
			boxHtml += '		<div class="contentField field" >';
			boxHtml += '			<textarea id="commentContent"></textarea>';
			boxHtml += '			<label class="commentContentLabel" for="commentContent">Content</label>';
			boxHtml += '		</div>';
			boxHtml += '		<div id="submitComment" class="ui button teal submit labeled icon">';
			boxHtml += '			<i class="icon edit"></i> 提交评论';
			boxHtml += '		</div>';
			boxHtml += '	</div>';
			boxHtml += '</form>';

			$(self).find("#commentFrom").append(boxHtml);
		}

		/**
		 * 功能: 绑定回复框的事件 参数: 无 返回: 无
		 */
		function addFormEvent() {
			// 先解除绑定
			$("textarea,input").die("focus");
			$("textarea,input").die("blur");
			// 绑定回复框效果
			$("textarea,input").live(
					"focus",
					function() {
						// 移除 失去焦点class样式，添加获取焦点样式
						$(this).next("label").removeClass("blur-foucs")
								.addClass("foucs");
					}).live(
					"blur",
					function() {
						// 如果文本框没有值
						if ($(this).val() == '') {
							// 移除获取焦点样式添加原生样式
							if ($(this).attr("id") == "commentContent") {
								$(this).next("label").removeClass("foucs")
										.addClass("areadefault");
							} else {
								$(this).next("label").removeClass("foucs")
										.addClass("inputdefault");
							}
						} else { // 有值 添加失去焦点class样式
							$(this).next("label").addClass("blur-foucs");
						}
					});

			// 绑定提交事件
			$("#submitComment").die("click");
			$("#submitComment").live("click", function() {
				var result = {
					"content" : $("#commentContent").val()
				};

				para.callback(result);
			});
		}
		;

	};

})(jQuery);


//设置评论成功之后的内容
function setCommentAfter(param) {

	
	 // 1.移除之前的取消回复按钮
	 $(self).find(".cancel").remove();
	 // 2.添加新评论的内容
	 addNewComment(param);
	 // 3.让评论框处于对文章评论的状态
	 removeAllCommentFrom();
	 // 4.添加根下的回复框
	 addRootCommentFrom();
}





//添加新评论的内容
 function addNewComment(comment){

	var item = '';
	item += '<div id="comment'+comment.comment_id+'" class="comment">';
	item += '	<a class="avatar">';
	item += '		<img src="images/foot.png">';
	item += '	</a>';
	item += '	<div class="content">';
	item += '		<a class="author"> '+comment.username+' </a>';
	item += '		<div class="metadata">';
	item += '			<span class="date"> '+comment.comment_time+' </span>';
	item += '		</div>';
	item += '		<div class="text"> '+comment.comment_content+' </div>';
	item += '		<div class="actions">';
	item += '			<a class="reply" href="javascript:void(0)" selfID="'+param.id+'" >回复</a>';
	item += '		</div>';
	item += '	</div>';
	item += '</div>';
	
	if(parseInt(fCode)==0){  // 如果对根添加
		$("#commentItems").append(item);
	}else{
		// 判断父级评论下是不是已经有了子级评论
		if($("#comment"+fCode).find(".comments").length==0){  // 没有
			var comments = '';
			comments += '<div id="comments'+fCode+'" class="comments">';
			comments += 	item;
			comments += '</div>';
			
			$("#comment"+fCode).append(comments);
		}else{  // 有
			$("#comments"+fCode).append(item);
		}
	}
}
