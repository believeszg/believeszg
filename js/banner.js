 var orde = 0; 
    var timer = null;
    	function autoPlay(){
    		timer = setInterval(function(){      
	    	if(orde < $(".imgList li").length-1){        
	    		orde ++;      
	    	}else{       
	    		orde = 0;     
	    	}     //调用变换处理函数     
	    	changeImg(orde);    
	    	},3000);
    	}
	   
	    function changeImg(num){    
		    $(".imgList").find("li").removeClass("show").hide().eq(num).fadeIn().addClass("show");  
	        $(".indexList").find("li").removeClass("active").eq(num).addClass("active"); 
	 
	    } 
	$(function(){
		autoPlay();
		 // 鼠标放到按钮上 换图
	    $('.indexList li').mouseover(function(){ 
	        orde = $(this).index();     
	        changeImg(orde); 
	    }) 
	
		//鼠标划入暂停
		$("#box").mouseenter(function(){
			$("#next").css({"display":"block"});
			$("#prev").css({"display":"block"});
			clearInterval(timer);
		});
	 	//鼠标移出继续轮播
		$("#box").mouseleave(function(){
			$("#next").css({"display":"none"});
			$("#prev").css({"display":"none"});
			autoPlay();
		});
		
	  // 下一张 
	    $('#next').click(function(){ 
	        orde++;
	        orde %= 5;
	        changeImg(orde); 
	    }) 

	    // 上一张 
	    $('#prev').click(function(){ 
	       orde--;
	        orde %= 5;
	        changeImg(orde); 
	    });
				
	});