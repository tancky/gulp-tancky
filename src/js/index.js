/**
 * Created by Tancky on 2018/5/4.
 */

$(function () {
  // 解决移动端300ms点击延迟
  FastClick.attach(document.body)
  // 初始化swiper
  let mySwiper = new Swiper('.swiper-container', {
    direction: 'vertical', // 竖向滚动
    allowTouchMove: false, // 禁止触摸滑动
    on: {
      init: function () {
        swiperAnimateCache(this) // 隐藏动画元素
        swiperAnimate(this) // 初始化完成开始动画
      },
      slideChangeTransitionStart: function () {
        swiperAnimateCache(this) // 隐藏动画元素
        swiperAnimate(this) // 初始化完成开始动画
      }
    }
  })
  // 函数命名空间
  let func = {
    switch_next () {
      // 首页点击进入下一页
      $('.swiper-button-next1').on('click', function () {
        mySwiper.slideNext()
      })
      // 获取对象昵称 点击进入下一页
      $('.swiper-button-next2').on('click', function () {
        data.obj_name = $('#obj_name').val() // 获取对象昵称(选填)
        data.your_name = $('#your_name').val() // 获取你的昵称(选填)
        if (data.obj_id !== '') {
          mySwiper.slideNext()
        } else {
          weui.alert('请选择表白对象')
        }
      })
      // 获取表白地点 点击进入下一页
      $('.swiper-button-next3').on('click', function () {
        if (data.place !== '') {
          mySwiper.slideNext()
        } else {
          weui.alert('请选择表白地点')
        }
      })
      // 获取表白内容 点击进入下一页
      $('.swiper-button-next4').on('click', function () {
        if (data.words !== '') {
          mySwiper.slideNext()
          // 内容生成中
          $.ajax({
            url: 'http://www.iliangcang.com/520/prog/getsharepic.php',
            data: {
              place: data.place,
              words: data.words,
              obj_name: data.obj_name, // 对象昵称(选填)
              your_name: data.your_name// 你的昵称(选填)
            },
            // 生成成功
            success: function (data) {
              let res = JSON.parse(data)
              let img_url = res.pic_url
              $('.section6 .result').attr('src', img_url)
              $('.section5').delay(2000).fadeOut().end().find($('.sec6-wrap')).show()
            }
          })
        } else {
          weui.alert('请选择表白语或输入要表白的话')
        }
      })
    },
    change_status () {
      // 点击切换选中按钮状态
      $('.section2 .options-list li').on('click', function () {
        data.obj_id = $(this).data('obj_id') // 获取表白id
        data.list = data.arr[data.obj_id].list // 获取当前点击对象的表白语数组
        $('.section2 .options-list li').find('i').hide()
        $(this).find('i').show()
        // 根据表白人物渲染不同的表白语
        let tpl = Handlebars.compile($('#list-tpl').html()) // 解析模板
        $('.section4 .options-list').html(tpl(data.list))
      })
      // 点击切换选中按钮状态
      $('.section3 .options-list li').on('click', function () {
        data.place = $(this).data('place') // 获取表白地点
        $('.section3 .options-list li').find('i').hide()
        $(this).find('i').show()
      })
      // 点击切换选中按钮状态
      $('.section4 .options-list').on('click', 'li', function (e) {
        $('.section4 .options-list li').find('i').hide()
        if ($('.love_words').text() == '' || $('.love_words').text() == '25个字以内') {
          data.words = e.currentTarget.innerText
          $(this).find('i').show()
        } else {
          weui.alert('您已输入表白语请清空后再试')
          data.words = $('.love_words').text()
        }
      })
    },
    change_mask () {
      // 点击显示表白对象遮罩层
      $('.zdy li').on('click', function () {
        console.log($(this).data('obj_id'))
        $('.mask1').fadeIn()
      })
      // 点击显示表白语遮罩层
      $('.custom').on('click', function () {
        console.log($(this).data('obj_id'))
        $('.mask2').fadeIn()
      })
      // 点击确认按钮获取输入框的值
      $('.confirm').on('click', function () {
        data.obj_name = $('#obj_name').val()
        data.your_name = $('#your_name').val()
        data.words = $('#words').val()
        $('.slot-1').text(data.obj_name)
        $('.slot-2').text(data.your_name)
        $('.love_words').text(data.words)
        $('.section4 .options-list li').find('i').hide()
        $('.obj-mask').hide()
      })
      // 取消
      $('.cancel').on('click', function () {
        $('.obj-mask').hide()
      })
    }
  }
  // 初始化变量数据
  let data = {
    obj_id: '', // 选择对象id
    obj_name: '', // 对象昵称(选填)
    your_name: '', // 你的昵称(选填)
    place: '', // 表白地点
    words: '', // 表白语
    arr: [
      {
        obj_id: 0,
        list: [
          {
            word: 0,
            love: '只要有你一个，就不孤独。'
          },
          {
            word: 1,
            love: '你连指尖都泛出好看的颜色。'
          },
          {
            word: 2,
            love: '我喜欢你，像喜欢春天的熊。'
          },
          {
            word: 3,
            love: '和我一起慢慢变老吧，最好的日子还在后头。'
          },
          {
            word: 4,
            love: '我是无数个我奔跑成一个我去睡你。'
          },
          {
            word: 5,
            love: '一想起你，我这张丑脸上就泛起微笑。'
          }
        ]
      },
      {
        obj_id: 1,
        list: [
          {
            word: 0,
            love: '咱们应当在一起，否则就太伤天害理啦。'
          },
          {
            word: 1,
            love: '静下来想你，觉得一切都美好得不可思议。'
          },
          {
            word: 2,
            love: '以后我就成了她打盹的枕头。'
          },
          {
            word: 3,
            love: '或许从没有爱过他，只是爱上了童话。'
          },
          {
            word: 4,
            love: '你还不来，我怎敢老去。'
          },
          {
            word: 5,
            love: '美人儿，我们去看看那玫瑰花。'
          }
        ]
      },
      {
        obj_id: 2,
        list: [
          {
            word: 0,
            love: '开心的一个家，是提早步入的天堂。'
          },
          {
            word: 1,
            love: '家人不是一件“重要的事”，而是一切。'
          },
          {
            word: 2,
            love: '上帝没法无处不在，于是创造了母亲。'
          },
          {
            word: 3,
            love: '我的妈妈是行走的奇迹。'
          },
          {
            word: 4,
            love: '有一位英雄，我管叫他爸爸。'
          },
          {
            word: 5,
            love: '一个父亲，胜过100个老师。'
          }
        ]
      },
      {
        obj_id: 3,
        list: [
          {
            word: 0,
            love: '和猫相处的时间，从来不是浪费。'
          },
          {
            word: 1,
            love: '越是了解人类，我就越喜欢狗。'
          },
          {
            word: 2,
            love: '我原本超喜欢狗，直到我发现了猫。'
          },
          {
            word: 3,
            love: '有些天使选择了毛，而不是翅膀。'
          },
          {
            word: 4,
            love: '狗子是我最喜欢的人类。'
          },
          {
            word: 5,
            love: '我的终生职业是铲屎官。'
          }
        ]
      },
      {
        obj_id: 4,
        list: [
          {
            word: 0,
            love: '我自己太有意思，无需他人陪伴。'
          },
          {
            word: 1,
            love: '我不完美，但我是限量款。'
          },
          {
            word: 2,
            love: '我不是喜欢自己，是为自己疯狂。'
          },
          {
            word: 3,
            love: '对我来说，我是世界上最大的谜。'
          },
          {
            word: 4,
            love: '当我需要专家指导，我和自己说话。'
          },
          {
            word: 5,
            love: '管他的，我只和自己约会。'
          }
        ]
      },
      {
        obj_id: 5,
        list: [
          {
            word: 0,
            love: '永远年轻，永远热泪盈眶。'
          },
          {
            word: 1,
            love: '做一个世界的水手，游遍每一个港口。'
          },
          {
            word: 2,
            love: '幸福的时光即虚度的年华。'
          },
          {
            word: 3,
            love: '生活给你准备的第二次机会，叫做明天。'
          },
          {
            word: 4,
            love: '安静地工作，让成功发声。'
          },
          {
            word: 5,
            love: '甜筒最好吃的是底端尖尖的部分。'
          }
        ]
      }
    ], // 表白语数组
    list: [], // 选中的表白语数组
    talk: '', // 想说的话
    init: (function () {
      $.ajax({
        url: 'http://www.iliangcang.com/520/prog/getshareparam.php?url=' + encodeURIComponent(location.href.split('#').toString()),
        // 生成成功
        success: function (data) {
          let res = JSON.parse(data)
          wx.config({
            debug: false,
            appId: res.appId,
            timestamp: res.timestamp,
            nonceStr: res.nonceStr,
            signature: res.signature,
            jsApiList: [
              'checkJsApi',
              'onMenuShareTimeline',
              'onMenuShareAppMessage'
            ]
          })
          wx.ready(function () {
            // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
            wx.onMenuShareTimeline({
              title: '520，你该表白了', // 分享标题
              // desc: '520，你准备好给谁表白了吗？', // 加该字段会报错
              link: 'http://www.iliangcang.com/520/index.html',
              imgUrl: 'http://imgs-qn.iliangcang.com/ware/sowhatimg/ware/orig/2/30/30250.jpeg',
              trigger: function (res) {
                // alert("分享到朋友圈按钮点击");
              },
              success: function (res) {

              },
              cancel: function (res) {

              },
              fail: function (res) {
                alert(JSON.stringify(res))
              }
            })
            wx.onMenuShareAppMessage({
              title: '520，你该表白了', // 分享标题
              desc: '520，你准备好给谁表白了吗？', // 分享描述
              link: 'http://www.iliangcang.com/520/index.html', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: 'http://imgs-qn.iliangcang.com/ware/sowhatimg/ware/orig/2/30/30250.jpeg', // 分享图标
              type: '', // 分享类型,music、video或link，不填默认为link
              dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
              success: function () {
                alert('ok')
                // 用户确认分享后执行的回调函数
              },
              cancel: function () {
                alert('已取消')
                // 用户取消分享后执行的回调函数
              }
            })
          })
        }
      }) // 获取app_id 调用sdk
      func.switch_next()
      func.change_status()
      func.change_mask()
    }()) // 初始化自动执行请求app_id
  }
})
