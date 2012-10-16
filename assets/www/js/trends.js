function trends(){				
	$.getJSON("http://search.twitter.com/search.json?callback=?&q=wewebconf", function (data) {

			$(".tweet").remove();
			$(".alert").hide();
			
			for(i in data.results){
				var tweet = data.results[i];
				console.log(tweet);
				var img = tweet.profile_image_url;
				var text = tweet.text;
				var user = tweet.from_user;
				var model='<li class="tweet"><a href="#tweet-dialog" data-rel="dialog" data-transition="none" onclick="setTweetDialog(this);"><img src='+img+' height="79"/><h3>'+user+'</h3><p>'+text+'</p></a></li>';
			
				$("#trends-list").append(model);
			}
			$("#trends-list").listview('refresh');
			$("#trends-list li").css('visibility','visible');	
		});
		
	}
				
	$('li a[href="#page6"]').click(trends);
	
	function trendsRefresh(){
		$(".alert").show();
		$(".tweet").remove(trends());
	}
	
	
	function setTweetDialog(elem){
		var img = $(elem).children("img").attr("src"),
			user = $(elem).children("h3").text(),
			tweet = $(elem).children("p").text();
		
		var modal = '<li style="display:inline;"><strong>'+user+'</strong><img style="float:left; margin-right:5px;" src="'+img+'"/> <br/><span>'+tweet+'</span></li>';
		
		$('#tweet-info li').remove();
		$('#tweet-info').prepend(modal);			
	}