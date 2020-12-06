"use strict";

var JWT = localStorage.getItem("token");
var axiosConfig = {
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Authorization": JWT,
    }
};
var users = [];
var baseURL = 'http://localhost:3000/'
var Dashboard = function () {
    var global = {
        tooltipOptions: {
            placement: "right"
        },
        menuClass: ".c-menu"
    };

    var menuChangeActive = function menuChangeActive(el) {
        var hasSubmenu = $(el).hasClass("has-submenu");
        $(global.menuClass + " .is-active").removeClass("is-active");
        $(el).addClass("is-active");

    };

    var sidebarChangeWidth = function sidebarChangeWidth() {
        var $menuItemsTitle = $("li .menu-item__title");

        $("body").toggleClass("sidebar-is-reduced sidebar-is-expanded");
        $(".hamburger-toggle").toggleClass("is-opened");

        if ($("body").hasClass("sidebar-is-expanded")) {
            $('[data-toggle="tooltip"]').tooltip("destroy");
        } else {
            $('[data-toggle="tooltip"]').tooltip(global.tooltipOptions);
        }
    };
    

    return {
        init: function init() {

            axios.get(`/api/advisor/history`, axiosConfig)
                .then(res => {
                    users = res.data.data;
                    $.each(users, function (i, user) {
                        appendToUsrTable(user);
                    });
                    $(document).ready(function () {
                        $('#patient-data').DataTable({
                            dom: 'B<"top"fi<"float-right"l>>t<"table_wrapper">r<"bottom"p>',
                            lengthMenu: [
                                [10, 25, 50, -1],
                                [10, 25, 50, "All"]
                            ],
                            "scrollX": true,
                            "scrollY": true,
                            autoWidth: false,
                            buttons: [{
                                extend: "csv",
                                title: "MONEY_BHAIYA_ADMIN_CLIENT_CSV_" + (new Date).toString().replace(/ /g, '-')
                            },
                            {
                                extend: "copy"
                            },
                            {
                                extend: "pdf",
                                title: "MONEY_BHAIYA_ADMIN_CLIENT_PDF_" + (new Date).toString().replace(/ /g, '-'),
                                orientation: 'potrait',
                                pageSize: 'A0'
                            },
                            {
                                extend: "excelHtml5",
                                title: "MONEY_BHAIYA_ADMIN_CLIENT_XLS__" + (new Date).toString().replace(/ /g, '-')
                            },
                            {
                                extend: "print",
                                title: "MONEY_BHAIYA_ADMIN_CLIENT_PRINT_" + (new Date).toString().replace(/ /g, '-')
                            }
                            ]
                        });
                    });
                })
                .catch(err => console.log('Login: ', err));
            $(".js-hamburger").on("click", sidebarChangeWidth);
            $(".js-menu li").on("click", function (e) {
                menuChangeActive(e.currentTarget);
            });

            $('[data-toggle="tooltip"]').tooltip(global.tooltipOptions);
        }
    };
}();
