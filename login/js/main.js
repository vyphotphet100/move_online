(function($) {
    "use strict";


    /*==================================================================
    [ Focus input ]*/
    $('.input100').each(function() {
        $(this).on('blur', function() {
            if ($(this).val().trim() != "") {
                $(this).addClass('has-val');
            } else {
                $(this).removeClass('has-val');
            }
        })
    })


    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit', function() {
        var check = true;

        for (var i = 0; i < input.length; i++) {
            if (validate(input[i]) == false) {
                showValidate(input[i]);
                check = false;
            }
        }

        return check;
    });


    $('.validate-form .input100').each(function() {
        $(this).focus(function() {
            hideValidate(this);
        });
    });

    function validate(input) {
        if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        } else {
            if ($(input).val().trim() == '') {
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }


    $('.login100-form-btn').click(function(e) {
        document.getElementsByClassName('login100-form-btn')[0].style.cssText = 'display:none;';
        document.getElementsByClassName('loading')[0].style.cssText = 'display:block;';

        e.preventDefault();
        var data = {};
        var formData = $('.login100-form').serializeArray();
        $.each(formData, function(i, v) {
            data["" + v.name + ""] = v.value;
        });

        setTimeout(function() {
            var userDto = UserRequest.login(data['username'], data['password']);

            if (userDto.httpStatus != 'OK') {
                alert(userDto.message);
                document.getElementsByClassName('loading')[0].style.cssText = 'display:none;';
                document.getElementsByClassName('login100-form-btn')[0].style.cssText = 'display:block;';
            }
            if (userDto.httpStatus == 'OK') {
                if (userDto.roleCodes.includes('USER'))
                    window.location.href = connecter.basePathAfterUrl + '/user_dashboard/dashboard';
                else if (userDto.roleCodes.includes('ADMIN'))
                    window.location.href = connecter.basePathAfterUrl + '/admin_dashboard/dashboard';
            }
        }, 10);

    });

})(jQuery);