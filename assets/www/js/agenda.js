/*
	Agenda.js
*/

var _SERVER = "http://localhost:3000";
//var _SERVER = "http://www.wewebconf.com.br/api";
//var _SERVER = "http://api.wewebconf.jit.su";

var _NO_CONNECTION = false;

function checkDomain(){
	$.ajax({
		type:"GET",
		url: _SERVER+"/schedule",
		success: successDomain,
		error: errorAgenda
	});
}

function successDomain(res){
	console.log(res);
	try{
		if(res.redirect.length > 3 && res.redirect != "none"){
			_SERVER = res.redirect;
			console.log("_SERVER CHANGED ",_SERVER);
			return(makeAgenda());
		}
		else{
			console.log("_SERVER NOT CHANGED ",_SERVER);
			return(makeAgenda());
		}
	}catch(err){
		console.log("_SERVER NOT CHANGED ",_SERVER);
		return(makeAgenda());
	}
}

function makeAgenda(){

	$.ajax({
		type:"GET",
		url: _SERVER+"/schedule",
		success: successAgenda,
		error: errorAgenda
	});
}

function successAgenda(res){
	_NO_CONNECTION = false;
	//console.log(res);
	var agenda = res;

	makeTalks(agenda);
	makeCourses(agenda);

	window.localStorage.setItem("wewebconf.agenda",JSON.stringify(agenda));

	$.mobile.hidePageLoadingMsg();
}

function errorAgenda(res){
	_NO_CONNECTION = true;

	agenda = window.localStorage.getItem("wewebconf.agenda");

	if(agenda == null) {
	    navigator.notification.alert("Verifique sua Conexão.", null, "We Web Conf", "Ok")
		return;
	}

	agenda = $.evalJSON(agenda);

	makeTalks(agenda);
	makeCourses(agenda);

	//console.log(agenda);

	$.mobile.hidePageLoadingMsg();
	
}

//Set Talks
function  makeTalks(agenda){
	
	$("#page5 span").remove();

	for(i in agenda.talks){
		var talk = agenda.talks[i];

		switch(talk.flag){
			case "start": {
				if(talk.timestamp.day == 15){
					$("#list-speakers").append('<li data-role="list-divider">Segunda, Outubro 15, 2012 </li>');			
				}

				if(talk.timestamp.day == 16){
					$("#list-speakers").append('<li data-role="list-divider">Terça, Outubro 16, 2012 </li>');			
				}

				var model = '<li> <h3>'+talk.title+'</h3> <p class="ui-li-aside"><strong>'+talk.hour+'</strong></p> </li>';

				$("#list-speakers").append(model);	

			} break;


			case "event":{
				var model = '<li> <a href="#talk-dialog" data-rel="dialog" data-transition="none" onclick="setTalkDialog(this);"><h3 name="title">'+talk.title+'</h3> <p name="speaker"><strong>'+talk.speaker+'</strong><p name="local"> Local: '+talk.local+'</p> <p name="hour" class="ui-li-aside"><strong>'+talk.hour+'</strong></p> <p name="avatar" data-img="'+talk.img+'"></p> <p name="about" data-text="'+talk.about+'"></p></a></li>';

				$("#list-speakers").append(model);	
			}break;

			case "interval":{
				var model = '<li> <h3>'+talk.title+'</h3> <p class="ui-li-aside"><strong>'+talk.hour+'</strong></p> </li>';

				$("#list-speakers").append(model);	
			}break;

			case "finish":{
				var model = '<li> <h3>'+talk.title+'</h3> <p class="ui-li-aside"><strong>'+talk.hour+'</strong></p> </li>';

				$("#list-speakers").append(model);	
			}break;			


		} //Switch

	}

	try{
		return($('#list-speakers').listview('refresh'));
	}catch(err){}
}


//Set Cousers
function  makeCourses(agenda){
	
	$("#page7 span").remove();

	for(i in agenda.courses){ var course = agenda.courses[i];
	
	//console.log(course);

		switch(course.flag){
			case "start": {
				if(course.timestamp.day == 15){
					$("#list-courses").append('<li data-role="list-divider">Segunda, Outubro 15, 2012 </li>');			
				}

				if(course.timestamp.day == 16){
					$("#list-courses").append('<li data-role="list-divider">Terça, Outubro 16, 2012 </li>');			
				}

				var model = '<li> <h3>'+course.title+'</h3> <p class="ui-li-aside"><strong>'+course.hour+'</strong></p> </li>';

				$("#list-courses").append(model);	

			} break;


			case "event":{
				var model = '<li> <a href="#course-dialog" data-rel="dialog" data-transition="none" onclick="setCourseDialog(this);"><h3 name="title">'+course.title+'</h3> <p name="speaker"><strong>'+course.speaker+'</strong><p name="local"> Local: '+course.local+'</p> <p class="ui-li-aside"><strong>'+course.hour+'</strong></p> <p name="img" data-img="'+course.img+'"></p></a></li>';

				$("#list-courses").append(model);	
			}break;

			case "interval":{
				var model = '<li> <h3>'+course.title+'</h3> <p class="ui-li-aside"><strong>'+course.hour+'</strong></p> </li>';

				$("#list-courses").append(model);	
			}break;

			case "finish":{
				var model = '<li> <h3>'+course.title+'</h3> <p class="ui-li-aside"><strong>'+course.hour+'</strong></p> </li>';

				$("#list-courses").append(model);	
			}break;			
		}//Switch
	}

	try{
		return($('#list-courses').listview('refresh'));
	}catch(err){}
}


function setTalkDialog(elem){
	var title = $(elem).children('h3[name="title"]').text(),
		speaker = $(elem).children('p[name="speaker"]').text(),
		local = $(elem).children('p[name="local"]').text(),
		hour = $(elem).children('p[name="hour"]').text();
		img = $(elem).children('p[name="avatar"]').attr("data-img"),
		about = $(elem).children('p[name="about"]').attr("data-text");

	if(about.length > 0) { var _about = '<br/><br/><span> <strong>Sobre: </strong>'+about+'</span>'; }
	else var _about = "";

	if(img.length > 3 && _NO_CONNECTION == false){ var _img = '<img style="float:left; margin-right:5px; width:75px; height:75px;" src="'+img+'"/>';}
	else var _img = "";

	var modal = '<li style="display:inline;">'+_img+' <strong>'+title+'</strong> <br/><span>Palestrante: '+speaker+'</span> <br/><span>'+local+'</span> <br/><span>Hora: '+hour+'</span> '+_about+'</li>';
	
	$('#talk-info li').remove();
	$('#talk-info').prepend(modal);
			
}


function setCourseDialog(elem){
	var title = $(elem).children('h3[name="title"]').text(),
		speaker = $(elem).children('p[name="speaker"]').text(),
		local = $(elem).children('p[name="local"]').text();
		img = $(elem).children('p[name="img"]').attr("data-img");

	if(img.length > 3 && _NO_CONNECTION == false){ var _img = '<img style="float:left; margin-right:5px; width:75px; height:75px;" src="'+img+'"/>';}
	else var _img = "";

	var modal = '<li style="display:inline;">'+_img+' <strong>'+title+'</strong> <br/><span>Palestrante: '+speaker+'</span> <br/><span>'+local+'</span> <br/><br/></li>';
	
	$('#course-info li').remove();
	$('#course-info').prepend(modal);
			
}

function refreshTalk(){
	$.mobile.showPageLoadingMsg();
	checkDomain(); 
}
