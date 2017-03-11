	// 获取第一个图片 节点对象 
			var firstImg = $('#DL dt').first().clone();
			// 放在 ul 的最后 
			$('#DL').append(firstImg).width($('#DL dt').length * 2000);

			var i = 0;

			var timers;

			autobox();

			// 下一张 
			$('#next').click(function() {
				i++;
				moveImg(i);
			})

			// 上一张 
			$('#prev').click(function() {
				i--;
				moveImg(i);
			})

			// auto box
			function autobox() {
				timers = setInterval(function() {
					i++;
					moveImg(i);
				}, 3000);

			}

			function moveImg(num) {

				// 如果是最后一张图片我们怎么办 
				if(i == $('#DL dt').length) {
					i = 1;
					$('#DL').css({ left: 0 });
				}

				// 是第一张 
				if(i == -1) {
					i = $('#DL dt').length - 2;
					$('#DL').css({ left: ($('#DL dt').length - 1) * -1294 });
				}

				// 移动图片 
				$('#DL').stop().animate({ left: i * -1294 }, 400);

				// 换小点的标记 
				if(i == ($('#DL dt').length - 1)) {
					$('#UL li').eq(0).addClass('active').siblings().removeClass('active');
				} else {
					$('#UL li').eq(i).addClass('active').siblings().removeClass('active');
				}
			}

			$('#box').mouseover(function() {
				$('#prev').show();
				$('#next').show();
				clearInterval(timers);
			}).mouseout(function() {
				$('#prev').hide();
				$('#next').hide();
				autobox();
			})

			// 点击小图标 跳转到指定的页面 
			$('#UL li').mouseover(function() {
				i = $(this).index();
				moveImg(i);
			});