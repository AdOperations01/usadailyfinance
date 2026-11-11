
	$(document).ready(function(){
		
		setTimeout(function(){
			$('#initTyping').remove();
			$('#msg1').removeClass('hidden').after(typingEffect());
			setTimeout(function(){
				$('.temp-typing').remove();
				$('#msg2').removeClass('hidden').after(typingEffect());
				scrollToBottom();
				setTimeout(function(){
					$('.temp-typing').remove();
					$('#msg3').removeClass('hidden').after(typingEffect());
					scrollToBottom();
					setTimeout(function(){
						$('.temp-typing').remove();
						$('#msg4').removeClass('hidden');
					}, 0);
				}, 1750);
			}, 1250);
		}, 750);

		var buttonValue;
		var currentStep;

		$('button.chat-button').on('click', function(){

			currentStep = $(this).attr('data-form-step');
			buttonValue = $(this).attr('data-form-value');

			if(currentStep == 1){

				$('#agentBlock3 .agent-chat').prepend(typingEffect());
				$('#msg4').addClass('hidden');
				$('#userBlock2').removeClass('hidden');

				if(buttonValue == 'No'){
					$('#msg9no').removeClass('hidden');
					$('#hdnApprovalStatus').val('No');
				} else {
					$('#msg9yes').removeClass('hidden');
				}
				scrollToBottom();
				setTimeout(function(){
					$('#agentBlock3').removeClass('hidden');
					scrollToBottom();
					setTimeout(function(){
						$('.temp-typing').remove();
						$('#msg10').removeClass('hidden').after(typingEffect());
						scrollToBottom();
						setTimeout(function(){
							$('.temp-typing').remove();
							$('#msg11').removeClass('hidden');
							scrollToBottom();
						}, 0);
					}, 1750);
				}, 50);

			}

			if(currentStep == 2){

			}


			if(currentStep == 3){

				$('#agentBlock4 .agent-chat').prepend(typingEffect());
				$('#msg11').addClass('hidden');
				$('#userBlock3b').removeClass('hidden');


				if(buttonValue == 'Yes'){
					$('#msg12yess').removeClass('hidden');
					$('#hdnAgeApproved').val('Yes');
					$('#hdnApprovalStatus').val('No');
					console.log("click yes");

				} else {
					$('#msg12-over55').removeClass('hidden');

					$('#hdnAgeApproved').val('No');
					$('#hdnApprovalStatus').val('No');   /* No must take the disapproved path */
				}
				scrollToBottom();

				if($('#hdnApprovalStatus').val() == 'No'){
					console.log("click 2");
//downsell
					/* no downsell number exists on this page, so do not reveal the
					   call button - show the not-eligible ending instead */
					$('#PrimaryNumber').addClass('hidden');
					$('#msg14disapproved').removeClass('hidden');
					$('#msg16disapproved').removeClass('hidden');
					


				} else {
//Primary
					console.log("click 3");
					$('#PrimaryNumber').removeClass('hidden');
					$('#msg14approved').removeClass('hidden');
					$('#msg16approved').removeClass('hidden');

				}

				var isAgeVerified = $('#hdnAgeApproved').val();

				scrollToBottom();

				setTimeout(function(){
					$('#agentBlock4').removeClass('hidden');
					scrollToBottom();
					setTimeout(function(){
						$('.temp-typing').remove();
						$('#msg13').removeClass('hidden').after(typingEffect());
						scrollToBottom();
						setTimeout(function(){
							$('.temp-typing').remove();
							$('#msg14').removeClass('hidden').after(typingEffect());
							scrollToBottom();
							setTimeout(function(){
								$('.temp-typing').remove();
								$('#msg15').removeClass('hidden').after(typingEffect());
								scrollToBottom();
								setTimeout(function(){
									$('.temp-typing').remove();
									$('#msg16').removeClass('hidden').after(typingEffect());
									scrollToBottom();
									setTimeout(function(){
										$('.temp-typing').remove();
										$('#msg17').removeClass('hidden');
										scrollToBottom();
									}, 0);
								}, 2250);
							}, 1250);
						}, 1750);
					}, 1250);
				}, 250);
			}
		});

		function scrollToBottom(elementId) {
			var object = $('main');
			$('html, body').animate({
				scrollTop: object.offset().top + object.outerHeight() - $(window).height()
			}, 'fast');
		}
});

function typingEffect(cssClass){

	string = '<div class="temp-typing bg-gray-200 p-3 rounded-lg shadow-xs mt-2 inline-block">';
	string += '<div class="typing-animation">';
	string += '<div class="typing-dot"></div>';
	string += '<div class="typing-dot"></div>';
	string += '<div class="typing-dot"></div>';
	string += '</div>';
	string += '</div>';

	return string;

}

var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

var currentDate = new Date();
var currentDayOfWeek = daysOfWeek[currentDate.getDay()];
var currentMonth = months[currentDate.getMonth()];
var currentDay = currentDate.getDate();
var currentYear = currentDate.getFullYear();
var formattedDate = currentDayOfWeek + ', ' + ('0' + (currentDate.getMonth() + 1)).slice(-2) + '/' + ('0' + currentDay).slice(-2) + '/' + currentYear;
document.getElementById('currentDate').textContent = formattedDate;

