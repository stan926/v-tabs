$(function(){
	$('.news-tabs-item').on('click', function(event) {
		var $this = $(this);
		var _index = $this.index();

		$this.addClass('active').siblings().removeClass('active');
		$('.news-content-item').hide().eq(_index).fadeIn('400');

	});

	$('.day-dot').on('click', function(event) {
		var $this = $(this);
		var _index = $this.index();

		$this.addClass('active').siblings().removeClass('active');
		$('.day-content').hide().eq(_index).fadeIn(600);
	});

})