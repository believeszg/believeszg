 <script type="text/javascript">  
    $(function () {  
    var i = 9;$(window).bind("scroll", function (event)  
    {  
    //滚动条到网页头部的 高度，兼容ie,ff,chrome  
    var top = document.body.scrollTop-document.documentElement.scrollTop  ;  
    //网页的高度  
    var textheight = $(document).height();  
    // 网页高度-top-当前窗口高度  
    if (textheight -textheight- top <= 100) { if (i >= 100) { return;
    //控制最大只能加载到100  
    }  
    $('#div1').css("height", $(document).height() + 100);i++;  
    //可以根据实际情况，获取动态数据加载 到 div1中  
    var j = parseInt(Math.random()*6)+1;
    var k = parseInt(Math.random()*100)+1;
    var z=[];
    $('<div>' + i + '<img src="images/g0'+ j +'0.jpg">'+'<a style="display:inline-block;float:right;text-decoration: none;line-height: 120px;font-size: 30px;">零售价:'+z+'￥'+k+'</a></div>').appendTo($('#div1'));
    }  
    });  
   }) 