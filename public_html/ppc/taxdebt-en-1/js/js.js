
console.log('nn')
$('#question_1').show()

var own_checking = ''
var declined_before = ''

/* ==========================================================================
   Step 4 = the congratulations card.
   The age-range step is OFF. Flip this to true to bring it back
   (it will route to #question_4_g1 / _g2 / _g3 exactly as before).
   NOTE: with the age step off, the "18 - 49" -> lbtrack offer redirect
   no longer fires; all traffic goes to the call card.
   ========================================================================== */
var ASK_AGE_RANGE = false

/* Ringba / phone routing per qualification bucket ------------------------- */
var PHONE_BUCKETS = {
    approved:    { display: '(877) 949-2573', tel: '+18779492573', ringba: '//b-js.ringba.com/CAd110c34ad27c42dbbec959c91f75727d' },
    '75':        { display: '(833) 760-8559', tel: '+18337608559', ringba: '//b-js.ringba.com/CAed9dc89204c24cffb7b8e68bf1cc142d' },
    graded:      { display: '(773) 340-8351', tel: '+17733408351', ringba: '//b-js.ringba.com/CAca3b48186a244caab03ec2a74f0fb62b' },
    nonchecking: { display: '(833) 340-2669', tel: '+18333402669', ringba: '//b-js.ringba.com/CAbefa0a60b5354d52b225d6d8d86e3fcf' }
}

/* Single entry point for showing the congratulations card ----------------- */
function goFinal(bucket){
    var p = PHONE_BUCKETS[bucket] || PHONE_BUCKETS.approved

    $('#question_1, #question_2, #question_3, #question_5').hide()
    $('#question_4, #question_4_g1, #question_4_g2, #question_4_g3').hide()
    $('.final').show()

    $('.cphone').attr('href', 'tel:' + p.tel)
    $('.cphone2').text(p.display)
    $('.gnumber strong').text(p.display)
    $('.number strong').text(p.display)
    $('.change-phone').attr('href', 'tel:' + p.tel)

    injectScript(p.ringba)
    offerl(bucket)

    // kick the application id + countdown in final.js
    if (typeof window.showFinalStep === 'function') window.showFinalStep()

    console.log('goFinal:', bucket, p.display)
}

/* Which bucket the answers land in ---------------------------------------- */
function qualifyBucket(){
    if (own_checking == 'yes' && declined_before == 'no') return 'approved'
    if (own_checking == 'no'  && declined_before == 'no') return 'nonchecking'
    return 'graded'
}

function offerl(offer){
    url2 = `https://eo3t4newqfsdkv.m.pipedream.net`
    console.log(url2)
    console.log('o',offer    )
    var params_url = new URL(window.location.href);
    $.ajax({
        url: url2,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            clickid: params_url.searchParams.get('clickid'),
            full_url: window.location.href,
            ip_address: $('#ip_address').val(),
            offer: offer
        }),
    }).then(function(res) {
        console.log(res);

        
    });
}

/* Only used when ASK_AGE_RANGE = true */
$('.show-final').click(e=>{
    if($(e.currentTarget).hasClass('show-approved')){
        goFinal('approved')
    }else if($(e.currentTarget).hasClass('show-75')){
        goFinal('75')
    }else if($(e.currentTarget).hasClass('show-graded')){
        goFinal('graded')
    }else if($(e.currentTarget).hasClass('show-nonchecking')){
        goFinal('nonchecking')
    }else{
        goFinal('approved')
    }
})

$('.question__option').click(e =>{
    console.log(e)
    console.log($(e.target).attr('data-option'))

    question = $(e.target).attr('data-option')

    if(question == 1){
        if($.trim($(e.currentTarget).text()) == 'NO'){
            $('#question_1').hide()
            // $('#question_1n').show()    
            $('#question_2').show()    
            // window.location.href = 'end.html'
        }else{
            $('#question_1').hide()
            $('#question_2').show()
        }
        
    }

    if(question == 2){
        $('#question_2').hide()
        $('#question_3').show()
    }

    if(question == 3){
        own_checking = $(e.currentTarget).text().toLowerCase()
        $('#question_3').hide()
        $('#question_5').show()
    }



    if(question == 5){
        declined_before = $.trim($(e.currentTarget).text().toLowerCase())

        var bucket = qualifyBucket()
        $('#question_5').hide()

        if(ASK_AGE_RANGE){
            if(bucket == 'approved'){
                $('#question_4_g1').show()
            }else if(bucket == 'nonchecking'){
                $('#question_4_g3').show()
            }else{
                $('#question_4_g2').show()
            }
        }else{
            goFinal(bucket)
        }
    }

    // if(question == 3){
    //     $('#question_3').hide()
    //     $('.final').show()
    // }
    
    // if(question == 3){
    //     console.log($(e.currentTarget).text(), 'fin')

    //     own_checking = $(e.currentTarget).text().toLowerCase()

    //     if (own_checking == 'yes'){
    //         $('.question-55').attr('href', 'https://ads.lbtrack.com/click/4')
    //         $('.question-76').attr('href', 'https://ads.lbtrack.com/click/5')
    //         $('#question_3').hide()
    //         $('#question_4').show()
    //         // $('#question_1n').show() 
    //     }else{
    //         $('#question_3').hide()
    //         $('#question_4').show()    
    //         // $('.question-55').attr('href', 'https://ads.lbtrack.com/click/5')
    //         // $('.question-76').attr('href', 'https://ads.lbtrack.com/click/5')

    //         $('.question-55').attr('href', 'https://ads.lbtrack.com/click/6')
    //         $('.question-76').attr('href', 'https://ads.lbtrack.com/click/6')
    //         // $('.question-18').attr('href', 'https://ads.lbtrack.com/click/5')
    //     }
        

    // }
})

review = document.querySelectorAll('.review__element')

review.forEach((ele, idx) =>{

    ele.style.zIndex = review.length - idx
})

$('.gofinal').click(e=>{
    console.log('here1',$.trim($(e.currentTarget).text()))
    if($.trim($(e.currentTarget).text()) == '76+' ){
        console.log('here')
        $('#question_4').hide()
        // $('.cphone').attr('href', 'tel:+18337608559') //phone in +1123456789 format
        // $('.cphone').attr('href', '')

        // console.log('href',$('.cphone').attr('href'))
        // $('.cphone').attr('href', 'tel:+18337608559')
        // console.log('href2',$('.cphone').attr('href'))
        
        $('.cphone2').text('(833) 760-8559') //phone in (822) 111-1234 format
        $('.cphone').attr('href', 'tel:+18337608559')
        injectScript('//b-js.ringba.com/CAed9dc89204c24cffb7b8e68bf1cc142d')
        
        console.log('w')
        // setTimeout(e=>{
        //     $('.cphone').attr('href', 'tel:+18337608559')
        //     console.log('hehe')
        // },900)
        $('.final').show()
        window.location.href = 'final.html' + location.search
    }else if ($.trim($(e.currentTarget).text()) == '55-75'){
        $('#question_4').hide()
        $('.cphone').attr('href', 'tel:+18779492573')
        $('.cphone2').text('(877) 949-2573') //phone in (822) 111-1234 format
        injectScript('//b-js.ringba.com/CAd110c34ad27c42dbbec959c91f75727d')
        $('.final').show()
        // window.location.href = 'finalstep.html' + location.search

        window.location.href = 'final.html' + location.search
    }
    else{
        $('#question_4').hide()
        $('.final').show()
        console.log('here2')
    }
    console.log('here3')
})


$(document).ready(function() {
    $(".review__element").click(function() {
      $("#review_1").animate({
      'left' : "50%",
      'opacity' : '0',
      'display' : 'none'
      },500);
    });
    // setTimeout(()=>{
    //     // $("#review_1").animate({
    //     //     'left' : "50% !important",
    //     //     // 'opacity' : '0',
    //     //     'display' : 'none'
    //     //     },500);

    //     $("#review_1").addClass('notactive').removeClass('active')
    //     $("#review_2").removeClass('notactive').addClass('active')
    // }, 1000)

    // setTimeout(()=>{
    //     // $("#review_1").animate({
    //     //     'left' : "50% !important",
    //     //     // 'opacity' : '0',
    //     //     'display' : 'none'
    //     //     },500);

    //     $("#review_2").addClass('notactive').removeClass('active')
    //     $("#review_3").removeClass('notactive').addClass('active')
    // }, 3000)

    // setTimeout(()=>{
    //     // $("#review_1").animate({
    //     //     'left' : "50% !important",
    //     //     // 'opacity' : '0',
    //     //     'display' : 'none'
    //     //     },500);

    //     $("#review_3").addClass('notactive').removeClass('active')
    //     $("#review_1").removeClass('notactive').addClass('active')
    // }, 5000)

    setInterval((e) =>{
        // console.log($('.active'))
        attri = $('.active')[0].id.charAt(7)
        // console.log(attri)

        $("#review_"+attri).addClass('notactive').removeClass('active')
        
        
        if(attri == 3){
            attri = 1
        }else{
            ++attri
        }
        
        $("#review_"+attri).removeClass('notactive').addClass('active')
        
    }, 4500)
})


function injectScript(src) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    document.body.appendChild(script);
  }

function injectRingbaPhone(place){
    if(place == 'approved'){
        $('.cphone').attr('href', 'tel:+18779492573')
        $('.cphone2').text('(877) 949-2573') //phone in (822) 111-1234 format
        injectScript('//b-js.ringba.com/CAd110c34ad27c42dbbec959c91f75727d')
    }else if(place == '75'){
        $('.cphone').attr('href', 'tel:+18337608559')
        $('.cphone2').text('(833) 760-8559') //phone in (822) 111-1234 format
        injectScript('//b-js.ringba.com/CAed9dc89204c24cffb7b8e68bf1cc142d')
    }else if(place == 'graded'){
        $('.cphone').attr('href', 'tel:+17733408351')
        $('.cphone2').text('(773) 340-8351') //phone in (822) 111-1234 format
        injectScript('//b-js.ringba.com/CAca3b48186a244caab03ec2a74f0fb62b')
    }else if(place == 'nonchecking'){
        $('.cphone').attr('href', 'tel:+18333402669')
        $('.cphone2').text('(833) 340-2669') //phone in (822) 111-1234 format
        injectScript('//b-js.ringba.com/CAbefa0a60b5354d52b225d6d8d86e3fcf')
    }
}