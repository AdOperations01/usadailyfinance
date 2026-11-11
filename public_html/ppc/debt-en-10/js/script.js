const headerToScroll = document.getElementById("header-scroll");
window.addEventListener("scroll", () => {
	if (headerToScroll) {
		headerToScroll.classList.toggle("scrolling", window.scrollY > 1);
	}
});

// For Footer Sticky Bar
const footerStickyBar = document.querySelector(".footer-sticky-bar");
const footerStickyText = document.querySelector(".sticky-text");
const footer = document.getElementById("footer");
document.addEventListener("DOMContentLoaded", () => {
	if (footerStickyText && footerStickyText.innerHTML.trim() !== "") {
		footerStickyBar.classList.remove("hide");
	}
	if (footerStickyBar && !footerStickyBar.classList.contains("hide")) {
		footer.classList.add("padding");
	}
});

var now = new Date();
now.setMinutes(0);
now.setSeconds(0);
now.setMinutes(new Date().getMinutes() > 30 ? 90 : 60);
var timenow = now.toLocaleTimeString().replace(/:\d{2} /, " ");
document.querySelectorAll(".time").forEach(function (time) {
	time.innerText = timenow;
});

addEventListener('input', event => {
	const { target, inputType } = event;
	
	if (target.type !== 'tel' || inputType == 'deleteContentBackward') return;

	const cleaned = target.value.replace(/\D/g, '');
	const match1 = cleaned.match(/(\d{1,3})/);
	const match2 = cleaned.match(/(\d{3})(\d{1,3})/);
	const match3 = cleaned.match(/(\d{3})(\d{3})(\d{1,4})/);

	if (match3) {
		target.value = '(' + match3[1] + ') ' + match3[2] + '-' + match3[3];
	} else if (match2) {
		target.value = '(' + match2[1] + ') ' + match2[2];
	} else if (match1) {
		target.value = '(' + match1[1] + ')';
	} else {
		target.value = cleaned;
	}
});

addEventListener('DOMContentLoaded', () => {
	const botKeywords = [
		'bot', 'crawl', 'spider', 'slurp', 'headless', 'phantom', 'selenium',
		'puppeteer', 'playwright', 'curl', 'wget', 'python', 'httpclient', 'scrapy',
	];

	const ua = navigator.userAgent.toLowerCase();
	const isBot = botKeywords.some(keyword => ua.includes(keyword));

	if (isBot || !window.ringba_campaign_id) return;

	const s = document.createElement('script');
	s.src = `//b-js.ringba.com/${window.ringba_campaign_id}`;
	s.async = true;
	document.head.appendChild(s);
});
