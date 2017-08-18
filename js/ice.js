
$(function(){


	document.body.addEventListener('touchmove', function(e) {
	    e.stopPropagation();
	    e.preventDefault();
	});

	const moveLayoutLeft = parseFloat($('html').css('width'))/3;
	const url = {
		hook: 'img/konggouzi.png',
		outline: 'img/outline.png',
		kongtong: 'img/tong-kong.png',
		daotong: 'img/tong-dao.png',
		bintong: 'img/tong-bin.png',
		shitong: 'img/tong-shi.png',
		p1: 'img/p1.png',
		p2: 'img/p2.png',
		p3: 'img/p3.png',
		flyb: 'img/flyb.png',
		flys: 'img/flys.png'
	}
	const fn = {
		randomUrl: function(){
			var n = Math.floor(Math.random() * 2);
			if (n){
				return url.bintong
			}else {
				return url.shitong
			}
		}
	}

	var level = 0;// 记录关卡
	var scoreNum = 0;// 得分

	//初始化游戏
	(function resetFn(){
		//固定三个水桶位置
		$('.hook_3').width(moveLayoutLeft);

		//初始化桶
		if($('.tong').length === 3){
			for (var i = 1; i < 3; i++) {
				$('.tong').eq(i).find('img').attr('src',fn.randomUrl());
			}
		}
	})();

	$('.body_layout').swipe({
		swipeUp:function(){
			level++;
			bucketGo('up');
			
		},
		swipeDown:function(){
			level++;
			bucketGo('down');
		}
	});

	//滑动触发事件，无限循环的必然事件
	function moveFn(){

		(function pulleyRotate(){
			$('.pulley').addClass('rotate');
			setTimeout(function(){
				$('.pulley').removeClass('rotate')
			},200)
		})();

		var nowFirst, nowLast, nowFirstLeft, nowLastLeft, $move_layout = $('.move_layout');

		nowFirstLeft = parseFloat($('.move_1').css('left'));
		nowLastLeft = parseFloat($('.move_2').css('left'));
		nowFirst = nowFirstLeft + moveLayoutLeft;
		nowLast = nowLastLeft - moveLayoutLeft;

		$move_layout.first().animate({'left': nowFirst}, 200,function(){
			$(this).css('left', nowFirstLeft);
		});
		$move_layout.last().children().append($createtong(url.hook, url.outline, fn.randomUrl()));
		setTimeout(function(){
			$move_layout.last().animate({'left': nowLast}, 200)
		},0);
		setTimeout(function(){
			$('.debug').hide();
		},200)
		
	};
	/*	
		hasBucket :boolean
		imgUrl :string
		返回jquery dom对象
	*/
	function $createtong(imgUrl_hook,imgUrl_line,imgUrl_tong){

		for(var i = 0;i < arguments.length; i++){
			if(typeof(arguments[i]) != 'string'){
				return false
			}
		}
		var $hook_3, $hook_box, $hook_img, $before_line, $before_img ,$tong, $tong_img;
		$hook_3 = $('<div>').addClass('hook_3');
		$hook_box  = $('<div>').addClass('hook_box');
		$hook_img = $('<img>').attr('src',imgUrl_hook);
		$before_line = $('<div>').addClass('before_line');
		$before_img = $('<img>').attr('src',imgUrl_line);
		$tong = $('<div>').addClass('tong');
		$tong_img = $('<img>').attr('src', imgUrl_tong);

		$hook_box.html($hook_img);
		$hook_3.html($hook_box);
		$before_line.html($before_img);
		$tong.html($tong_img);
		$hook_3.children().append($tong).append($before_line);
		// console.log($hook_3[0]);
		return $hook_3;
	}


	//冰桶翻转
	function bucketGo(direction){
		$('.debug').show();

		if(direction === 'up'){
			var _stateUrl = $('.tong').eq(level).find('img').attr('src');
			//石头或水飞走

			if (_stateUrl == url.bintong){

				$('.fly_dom').find('img').attr('src',url.flyb)
			}
			if(_stateUrl == url.shitong){
				$('.fly_dom').find('img').attr('src',url.flys)
			}

			$('.tong').eq(level).find('img').attr('src',url.kongtong);//变成空的
			$('.fly_dom').show().addClass('flyout');
			setTimeout(function(){
				$('.fly_dom').hide().removeClass('flyout');
			},200);

			personGo();

		}else if(direction === 'down'){
			var _stateUrl = $('.tong').eq(level).find('img').attr('src');

			$('.tong').eq(level).addClass('rotate_180');
			//假设翻转水桶用时0.3s，完成后调用下一个方法

			setTimeout(function(){
				$('.tong').eq(level).find('img').attr('src',url.daotong);
				personGo(_stateUrl);
			},200)
		}
		
		
		
	};
	//小人动作
	function personGo(stateUrl){

		if(stateUrl == url.bintong){
			//得分
			$('.person_layout').find('img').attr('src',url.p3);
			scoreNum++;
			setTimeout(function(){
				$('.person_layout').find('img').attr('src',url.p1);
				$('#scoreNum').text(scoreNum);
			},300)
		}
		if(stateUrl == url.shitong){
			$('.person_layout').find('img').attr('src',url.p2);
			scoreNum--;
			setTimeout(function(){
				$('.person_layout').find('img').attr('src',url.p1);
				$('#scoreNum').text(scoreNum);
			},300)
		}
		moveFn();
	}

	
})