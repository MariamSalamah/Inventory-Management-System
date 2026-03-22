$(document).ready(function () {
  //^  handel ROutes
  $("main section").hide();
  $("main section.Dashboard").show();
  $(".link[data-target]").on("click", function () {
    const target = $(this).data("target");
    $("main section").hide();
    $("main section." + target).show();
    $(".link").removeClass("active");
    $(`aside .link[data-target='${target}']`).addClass("active");
    closeAside();
  });

  //^ open and close sidebar
  function openAside() {
    $("aside").addClass("open").removeClass("closed");
    $(".overlay").addClass("show");
  }
  function closeAside() {
    $("aside").removeClass("open").addClass("closed");
    $(".overlay").removeClass("show");
    if ($(window).width() > 992) {
      $("aside").removeClass("closed");
      $("nav").removeClass("open");
      $("main").removeClass("open");
    }
  }
  $(".fa-bars").on("click", function () {
    if (
      $("aside").hasClass("open") ||
      (!$("aside").hasClass("closed") && $(window).width() > 992)
    ) {
      if ($(window).width() > 992) {
        $("aside").toggleClass("closed");
        $("nav").toggleClass("open");
        $("main").toggleClass("open");
      } else {
        closeAside();
      }
    } else {
      openAside();
    }
  });

  $(".close-aside").on("click", function () {
    closeAside();
    if ($(window).width() > 992) {
      $("aside").addClass("closed");
      $("nav").addClass("open");
      $("main").addClass("open");
    }
  });
  $(".overlay").on("click", function () {
    closeAside();
  });
});
