/**
 * Created by Tancky on 2018/5/4.
 */
$(function () {
  $('.list li').on('click', function () {
    console.log($(this).data('id'))
  })
})