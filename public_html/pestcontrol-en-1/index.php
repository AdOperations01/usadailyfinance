<?php



$redirectUrl = "https://globalvisitclub.com/cf/click/1";

$pests = [
    [
        "id" => "ants",
        "name" => "Ants & Insects",
        "image" => "assets/ants.png"
    ],
    [
        "id" => "cockroaches",
        "name" => "Cockroaches",
        "image" => "assets/cockroaches.png"
    ],
    [
        "id" => "mice-rats",
        "name" => "Mice & Rats",
        "image" => "assets/mice-rats.png"
    ],
    [
        "id" => "termites",
        "name" => "Termites",
        "image" => "assets/termites.png"
    ],
    [
        "id" => "bed-bugs",
        "name" => "Bed Bugs",
        "image" => "assets/bed-bugs.png"
    ],
    [
        "id" => "mosquitoes",
        "name" => "Mosquitoes",
        "image" => "assets/mosquitoes.png"
    ],
    [
        "id" => "bees-wasps",
        "name" => "Bees & Wasps",
        "image" => "assets/bees-wasps.png"
    ],
    [
        "id" => "other",
        "name" => "Other / Not Sure",
        "image" => "assets/other.png"
    ]
];



/*
|--------------------------------------------------------------------------
| CTA Destination
|--------------------------------------------------------------------------
*/



?>

<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
>

<title>
    Pest Control Options
</title>

<meta
    name="description"
    content="Answer one quick question to explore pest control options in your area."
>


<style>

/* =========================================================
   GLOBAL
========================================================= */

* {
    box-sizing: border-box;
}

html {
    margin: 0;
    padding: 0;
}

body {
    margin: 0;
    padding: 0;

    font-family:
        Arial,
        Helvetica,
        sans-serif;

    color: #111827;

    background: #ffffff;
}

button,
a {
    font-family: inherit;
}


/* =========================================================
   VARIABLES
========================================================= */

:root {

    --green: #16853b;

    --green-dark: #0f6f31;

    --green-light: #f4faf5;

    --text: #111827;

    --muted: #626b65;

    --border: #e1e6e2;

}


/* =========================================================
   HERO SECTION
========================================================= */

.hero {

    position: relative;

    min-height: 470px;

    display: flex;

    align-items: center;

    justify-content: center;

    text-align: center;

    overflow: hidden;

    background: #edf7ef;

}


.hero-bg {

    position: absolute;

    inset: 0;

    width: 100%;

    height: 100%;

    object-fit: cover;

    object-position: center;

    opacity: .30;

}


.hero-overlay {

    position: absolute;

    inset: 0;

    background:
        linear-gradient(
            90deg,
            rgba(255,255,255,.97) 0%,
            rgba(255,255,255,.91) 45%,
            rgba(255,255,255,.65) 100%
        );

}


.hero-content {

    position: relative;

    z-index: 2;

    width: 100%;

    max-width: 950px;

    padding: 50px 20px;

}


/* =========================================================
   BADGE
========================================================= */

.badge {

    display: inline-flex;

    align-items: center;

    justify-content: center;

    gap: 8px;

    background: #ffffff;

    border-radius: 30px;

    padding: 11px 20px;

    font-size: 15px;

    font-weight: 700;

    box-shadow:
        0 3px 18px rgba(0,0,0,.08);

    margin-bottom: 24px;

}


.badge-icon {

    color: var(--green);

    font-size: 20px;

}


/* =========================================================
   HERO HEADING
========================================================= */

h1 {

    margin: 0 auto 16px;

    font-size:
        clamp(
            38px,
            6vw,
            68px
        );

    line-height: 1.05;

    letter-spacing: -2px;

}


.green {

    color: var(--green);

}


.sub {

    font-size:
        clamp(
            18px,
            2.3vw,
            25px
        );

    line-height: 1.45;

    max-width: 700px;

    margin: 0 auto 32px;

    color: #20252b;

}


/* =========================================================
   HERO BENEFITS - DESKTOP
========================================================= */

.benefits {

    display: flex;

    justify-content: center;

    align-items: flex-start;

    flex-wrap: nowrap;

    width: 100%;

    max-width: 900px;

    margin: 0 auto;

}


.benefit {

    min-width: 200px;

    padding:
        12px 28px;

    font-weight: 700;

    text-align: center;

    border-right:
        1px solid #d8ddd9;

}


.benefit:last-child {

    border-right: none;

}


.benefit-icon {

    width: 46px;

    height: 46px;

    display: grid;

    place-items: center;

    margin: 0 auto 8px;

    border-radius: 50%;

    background: var(--green);

    color: #ffffff;

    font-size: 22px;

}


/* =========================================================
   QUIZ SECTION
========================================================= */

.quiz {

    width: 100%;

    max-width: 1150px;

    margin: 0 auto;

    padding:
        55px 20px
        65px;

    text-align: center;

}


/* =========================================================
   QUESTION
========================================================= */

.question {

    max-width: 900px;

    margin:
        0 auto 12px;

    font-size:
        clamp(
            28px,
            4vw,
            44px
        );

    line-height: 1.15;

}


.helper {

    margin:
        0 auto 32px;

    color: var(--muted);

    font-size: 17px;

}


/* =========================================================
   PEST GRID - DESKTOP
========================================================= */

.grid {

    display: grid;

    grid-template-columns:
        repeat(4, 1fr);

    gap: 16px;

    max-width: 1000px;

    margin:
        0 auto 32px;

}


/* =========================================================
   PEST OPTION
========================================================= */

.option {

    appearance: none;

    width: 100%;

    min-height: 190px;

    padding: 18px 12px;

    border:
        1px solid var(--border);

    border-radius: 18px;

    background: #ffffff;

    cursor: pointer;

    display: flex;

    flex-direction: column;

    align-items: center;

    justify-content: center;

    transition:
        border-color .18s ease,
        box-shadow .18s ease,
        transform .18s ease;

    box-shadow:
        0 5px 18px rgba(0,0,0,.05);
        text-decoration: none;

}


.option:hover {

    border-color: var(--green);

    transform:
        translateY(-2px);

    box-shadow:
        0 8px 24px
        rgba(22,133,59,.14);

}


.option.selected {

    border:
        3px solid #1264c7;

    box-shadow:
        0 8px 25px
        rgba(18,100,199,.13);

}


/* =========================================================
   IMAGE WRAPPER
========================================================= */

.option-image {

    width: 108px;

    height: 108px;

    overflow: hidden;

    border-radius: 50%;

    display: flex;

    justify-content: center;

    align-items: flex-start;

    background: #ffffff;

    margin-bottom: 13px;

    /*
       Crops the original image.
       This hides the text that is already
       embedded inside the PNG.
    */

    clip-path:
        circle(50%);

}


/* =========================================================
   IMAGE
========================================================= */

.option-image img {

    display: block;

    width: 112px;
    margin: 0 0 0 -20px;
    height: 150px;

    max-width: none;

    object-fit: fill;

    object-position: top center;

    border: none !important;

    outline: none !important;

    box-shadow: none !important;

    transform:
        translateY(-2px);

}


/* =========================================================
   PEST TITLE
========================================================= */

.option-title {

    color: #111111;

    font-size: 20px;

    font-weight: 800;

    line-height: 1.15;

    text-align: center;

}


/* =========================================================
   CTA
========================================================= */

.cta {

    display: inline-flex;

    align-items: center;

    justify-content: center;

    gap: 15px;

    min-width: 360px;

    padding:
        18px 36px;

    border: none;

    border-radius: 12px;

    background:
        linear-gradient(
            135deg,
            var(--green),
            #24a44d
        );

    color: #ffffff;

    font-size: 22px;

    font-weight: 800;

    text-decoration: none;

    cursor: pointer;

    box-shadow:
        0 8px 22px
        rgba(22,133,59,.25);

    transition:
        transform .15s ease,
        opacity .15s ease;

}


.cta:hover {

    transform:
        translateY(-1px);

}


.cta.disabled {

    opacity: .5;

    cursor: not-allowed;

    pointer-events: none;

}


/* =========================================================
   REASSURANCE
========================================================= */

.reassurance {

    padding:
        35px 20px;

    background:
        var(--green-light);

}


.reassurance-grid {

    max-width: 1050px;

    margin: 0 auto;

    display: grid;

    grid-template-columns:
        repeat(4, 1fr);

    gap: 20px;

    text-align: center;

}


.r-icon {

    margin-bottom: 8px;

    color: var(--green);

    font-size: 32px;

}


.r-title {

    margin-bottom: 5px;

    font-size: 17px;

    font-weight: 800;

}


.r-text {

    color: #59625d;

    font-size: 14px;

    line-height: 1.4;

}


/* =========================================================
   FOOTER
========================================================= */

.footer {

    padding:
        14px 20px;

    background:
        #08712f;

    color: #ffffff;

    text-align: center;

    font-size: 14px;

}


/* =========================================================
   TABLET
========================================================= */

@media (max-width: 900px) {

    .grid {

        grid-template-columns:
            repeat(2, 1fr);

        max-width: 700px;

    }


    .reassurance-grid {

        grid-template-columns:
            repeat(2, 1fr);

    }

}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 600px) {


    /* -----------------------------------------
       HERO
    ----------------------------------------- */

    .hero {

        min-height: 500px;

    }


    .hero-content {

        padding:
            35px 16px;

    }


    h1 {

        font-size: 40px;

        letter-spacing: -1px;

    }


    .sub {

        font-size: 18px;

        margin-bottom: 24px;

    }


    /* -----------------------------------------
       MOBILE BENEFITS

       ROW 1:
       1 + 2

       ROW 2:
       3 CENTERED
    ----------------------------------------- */

    .benefits {

        display: grid;

        grid-template-columns:
            repeat(2, 1fr);

        align-items: start;

        gap:
            18px 8px;

        width: 100%;

        max-width: 390px;

        margin: 0 auto;

    }


    .benefit {

        min-width: 0;

        width: 100%;

        padding: 5px;

        border-right: none;

        text-align: center;

    }


    /*
       Third benefit moves to
       the second row and centers.
    */

    .benefit:nth-child(3) {

        grid-column:
            1 / 3;

        justify-self: center;

        width: 50%;

    }


    .benefit-icon {

        width: 48px;

        height: 48px;

        margin:
            0 auto 7px;

        font-size: 22px;

    }


    /* -----------------------------------------
       QUIZ
    ----------------------------------------- */

    .quiz {

        padding:
            40px 12px
            50px;

    }


    .question {

        font-size: 30px;

    }


    .helper {

        font-size: 15px;

        margin-bottom: 24px;

    }


    /* -----------------------------------------
       PEST GRID
       2 COLUMNS ON MOBILE
    ----------------------------------------- */

    .grid {

        grid-template-columns:
            repeat(2, minmax(0, 1fr));

        gap: 12px;

        width: 100%;

    }


    .option {

        min-height: 165px;

        padding:
            12px 6px;

        border-radius: 15px;

    }


    /* -----------------------------------------
       PEST IMAGE
    ----------------------------------------- */

    .option-image {

        width: 82px;

        height: 82px;

        margin-bottom: 9px;

    }


    .option-image img {

        width: 86px;

        height: 115px;

    }


    .option-title {

        font-size: 16px;

        line-height: 1.15;

    }


    /* -----------------------------------------
       CTA
    ----------------------------------------- */

    .cta {

        width: 100%;

        min-width: 0;

        padding:
            17px 20px;

        font-size: 19px;

    }


    /* -----------------------------------------
       REASSURANCE
    ----------------------------------------- */

    .reassurance {

        padding:
            30px 12px;

    }


    .reassurance-grid {

        grid-template-columns:
            repeat(2, 1fr);

        gap:
            20px 8px;

    }


    .r-title {

        font-size: 15px;

    }


    .r-text {

        font-size: 13px;

    }

}


/* =========================================================
   SMALL MOBILE
========================================================= */

@media (max-width: 380px) {


    h1 {

        font-size: 36px;

    }


    .question {

        font-size: 27px;

    }


    .option {

        min-height: 155px;

    }


    .option-image {

        width: 74px;

        height: 74px;

    }


    .option-image img {

        width: 78px;

        height: 105px;

    }


    .option-title {

        font-size: 15px;

    }

}

</style>

</head>


<body>


<!-- =======================================================
     HERO
======================================================== -->

<section class="hero">


    <img
        class="hero-bg"
        src="assets/hero.webp"
        alt=""
        aria-hidden="true"
    >


    <div class="hero-overlay"></div>


    <div class="hero-content">


        <div class="badge">

            <span class="badge-icon">
                ✓
            </span>

            Trusted by Homeowners Across the U.S.

        </div>


        <h1>

            Take the First Step<br>

            Toward a

            <span class="green">
                Pest-Free Home
            </span>

        </h1>


        <p class="sub">

            Answer one quick question to see pest control
            options in your area.

        </p>


        <!-- =================================================
             BENEFITS
        ================================================== -->

        <div class="benefits">


            <!-- BENEFIT 1 -->

            <div class="benefit">

                <div class="benefit-icon">
                    ✓
                </div>

                Local Pest Control<br>
                Professionals

            </div>


            <!-- BENEFIT 2 -->

            <div class="benefit">

                <div class="benefit-icon">
                    ★
                </div>

                Compare Options<br>
                Near You

            </div>


            <!-- BENEFIT 3 -->

            <div class="benefit">

                <div class="benefit-icon">
                    🔒
                </div>

                Free &amp; No<br>
                Obligation

            </div>


        </div>


    </div>

</section>


<!-- =======================================================
     QUIZ
======================================================== -->

<section class="quiz">


    <h2 class="question">

        What

        <span class="green">
            pest problem
        </span>

        are you currently dealing with?

    </h2>


    <p class="helper">

        Select the option that best matches your situation.

    </p>


    <!-- =====================================================
         PEST OPTIONS
    ====================================================== -->

<div class="grid">

    <?php foreach ($pests as $pest): ?>

        <a
            href="<?php echo htmlspecialchars($redirectUrl); ?>"
            class="option"
            data-pest="<?php echo htmlspecialchars($pest['name']); ?>"
        >

            <div class="option-image">

                <img
                    src="<?php echo htmlspecialchars($pest['image']); ?>"
                    alt=""
                    aria-hidden="true"
                >

            </div>

            <div class="option-title">

                <?php echo htmlspecialchars($pest['name']); ?>

            </div>

        </a>

    <?php endforeach; ?>

</div>


    <!-- =====================================================
         CTA
    ====================================================== -->

    <a
        href="https://globalvisitclub.com/cf/click/1"
        class="cta "
    >

        Check My Options

        <span>
            →
        </span>

    </a>


</section>


<!-- =======================================================
     REASSURANCE
======================================================== -->

<section class="reassurance">


    <div class="reassurance-grid">


        <div>

            <div class="r-icon">
                ✓
            </div>

            <div class="r-title">
                Trusted &amp; Verified
            </div>

            <div class="r-text">
                Explore pest control options for your home.
            </div>

        </div>


        <div>

            <div class="r-icon">
                ◷
            </div>

            <div class="r-title">
                Fast &amp; Easy
            </div>

            <div class="r-text">
                Answer one quick question and continue.
            </div>

        </div>


        <div>

            <div class="r-icon">
                $
            </div>

            <div class="r-title">
                Free Estimates
            </div>

            <div class="r-text">
                Explore available quote options with no obligation.
            </div>

        </div>


        <div>

            <div class="r-icon">
                ⌂
            </div>

            <div class="r-title">
                Pest-Free Peace of Mind
            </div>

            <div class="r-text">
                Find options that may fit your pest problem.
            </div>

        </div>


    </div>


</section>


<!-- =======================================================
     FOOTER
======================================================== -->

<footer class="footer">

    🔒 Your information is secure.

</footer>


<!-- =======================================================
     JAVASCRIPT
======================================================== -->

<script>

const options =
    document.querySelectorAll(".option");


const continueBtn =
    document.getElementById("continueBtn");


let selectedPest = "";


/*
|--------------------------------------------------------------------------
| Pest Selection
|--------------------------------------------------------------------------
*/

options.forEach(function(option) {

    option.addEventListener(
        "click",
        function() {


            /*
             * Remove old selection
             */

            options.forEach(
                function(item) {

                    item.classList.remove(
                        "selected"
                    );

                }
            );


            /*
             * Select current option
             */

            option.classList.add(
                "selected"
            );


            /*
             * Store selected pest
             */

            selectedPest =
                option.getAttribute(
                    "data-value"
                );


            /*
             * Enable CTA
             */

            continueBtn.classList.remove(
                "disabled"
            );


            continueBtn.setAttribute(
                "aria-disabled",
                "false"
            );


        }
    );

});


/*
|--------------------------------------------------------------------------
| CTA Protection
|--------------------------------------------------------------------------
|
| User must select a pest before continuing.
|
*/

continueBtn.addEventListener(
    "click",
    function(event) {

        if (!selectedPest) {

            event.preventDefault();

            return false;

        }

    }
);

</script>


</body>

</html>