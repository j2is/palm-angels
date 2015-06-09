var pa = {
	
	init: function()
	{
    pa.slides.init()
    pa.overview.init()
    pa.nav.init()
    pa.images.init()
		
		bean.on( document, 'keyup', pa.keys )
		
		var v = eina.video()
		if( v.mpeg4 || v.h264 || v.webm )
		  document.documentElement.setAttribute('data-support-video', 'true')
		  
		eina.autoplay(function(){ 
		  document.documentElement.setAttribute('data-support-autoplay', 'true') 
		})
	},
	
	keys: function( _e )
	{
	  switch( _e.which ){
			case 37: // LEFT
			  pa.slides.back()
				break
			
			case 39: // RIGHT
			  pa.slides.fwd.next()
				break
		}
	},
	
	slides: {
	  
	  c: document.getElementById('slides'),
	  s: document.getElementById('slides').querySelectorAll('[data-slide]'),
	  t: {},
    skip: undefined,
	  
	  init: function()
	  {
	    bean.on( pa.slides.c, 'click', pa.slides.fwd.next )
	    
	    pa.slides.setup()
	  },
	  
	  setup: function( _x )
	  {
      var n
      
      if( typeof _x == 'string' )
        n = document.getElementById( _x )
      else {
  	    var s = pa.slides.s
  	    var x = ( _x >= 0 && _x < s.length ) ? _x : Math.floor( Math.random() * (s.length-1) )
        n = s[ x ]
      }
      
      if( n ){
        pa.slides.reset()
        n.setAttribute('data-slide', 'now')
        pa.slides.features.check( n )
      }
      else
        console.error('Slide '+_x+' not found')
	  },
	  	  
	  reset: function( _s )
	  {
	    var s = _s || pa.slides.s
	    for( var i = 0; i < s.length; i++ )
	      s[ i ].setAttribute('data-slide', '')
	  },
	  
	  fwd: {
	    
	    next: function( _e )
	    {
	  	  clearTimeout( pa.slides.skip )
	  	  
	  	  var d = { a: 0, b: 0 }
	  	  
	  	  var a = pa.slides.c.querySelector('[data-slide="now"]')
	  	  if( !a )
	  	    a = pa.slides.c.querySelector('[data-slide="in"]')
  	    if( a )
  	      d.a = pa.slides.fwd.out( a )
  	    else
  	      a = pa.slides.c.querySelector('[data-slide="out"]')
	      
	      clearTimeout( pa.slides.t[ a.id ] )
	      if( d.a ){
	        pa.slides.t[ a.id ] = setTimeout(function(){
	          pa.slides.fwd.prev( a, d )
	        }, d.a)
	      }
	      else
	        pa.slides.fwd.prev( a, d )
	    },
      
      out: function( _a )
      {
        if( _a.hasAttribute('data-delay-out') ){
          _a.setAttribute('data-slide', 'out')
          return _a.getAttribute('data-delay-out')
        }
        return false
      },
      
      prev: function( _a, _d )
      {
        _a.setAttribute('data-slide', '') // prev
        
        var d = _d
        
        var b = _a.nextElementSibling
        if( !b ){
          b = pa.slides.s[ 0 ]
          pa.slides.reset()
        }
        
        d.b = pa.slides.fwd.in( b )
        pa.slides.features.dependencies( b )
        pa.slides.features.nav( b )
        pa.slides.features.video.play( b )
        
        if( d.b ){
          pa.slides.t[ b.id ] = setTimeout(function(){ 
            pa.slides.fwd.now( b ) 
          }, d.b)
        }
        else
          pa.slides.fwd.now( b )
      },
      
      in: function( _b )
      {
        if( _b.hasAttribute('data-delay-in') ){
          _b.setAttribute('data-slide', 'in')
          return _b.getAttribute('data-delay-in')
        }
        return false
      },
      
      now: function( _b )
      {
        _b.setAttribute('data-slide', 'now')
        pa.slides.features.video.pause( _b )
        pa.slides.features.goldstars.check( _b )
        pa.slides.features.goldbars.check( _b )
        pa.slides.features.skip( _b )
      }
      
    },
	  
	  back: function( _e )
	  {
	    clearTimeout( pa.slides.skip )
	    
	    var d = { a: 0, b: 0 }
	    
	    var a = pa.slides.c.querySelector('[data-slide="now"]')	    
	    if( !a )
	      a = pa.slides.c.querySelector('[data-slide="in"]')
      if( !a )
        a = pa.slides.c.querySelector('[data-slide="out"]')
	    
	    clearTimeout( pa.slides.t[ a.id ] )
	    
	    a.setAttribute('data-slide', '') // next
	    pa.slides.features.video.check( a )
	    
	    var b = a.previousElementSibling
	    if( !b ){
        b = pa.slides.s
        b = b[ b.length-1 ]
	      pa.slides.reset()
	    }
	    
	    b.setAttribute('data-slide', 'now')
	    pa.slides.features.dependencies( b )
	    pa.slides.features.nav( b )
	    pa.slides.features.video.check( b )
	    pa.slides.features.skip( b )
	  },
	  
	  features: {
	    
	    check: function( _a )
	    {
	      pa.slides.features.dependencies( _a )
        pa.slides.features.nav( _a )
	      pa.slides.features.video.check( _a )
	      pa.slides.features.goldstars.check( _a )
	      pa.slides.features.goldbars.check( _a )
	      pa.slides.features.skip( _a )
	    },
	    
	    dependencies: function( _a )
	    {
	      var n = _a || pa.slides.c.querySelector('[data-slide="now"]')
	      
	      if( n.hasAttribute('data-depend') ){
	        var p = n.getAttribute('data-depend').split(' ')
	        for( var i = 0; i < p.length; i++ ){
	          var a = document.getElementById( p[i] )
	          a.setAttribute('data-slide', 'prev')
	          pa.slides.features.video.check( a )
	        }
	      }
	      else {
	        var p = pa.slides.c.querySelectorAll('[data-slide="prev"]')
	        pa.slides.reset( p )
	      }
	    },
	    
	    nav: function( _a )
	    {
        pa.nav.setColor( _a.getAttribute('data-nav-color') )
	    },
	    
	    video: {
	      
	      check: function( _a )
	      {
          pa.slides.features.video.pause( _a )
          pa.slides.features.video.play( _a )
	      },
	      
	      play: function( _a )
	      {
	        if( _a.hasAttribute('data-video-play') )
  	        document.getElementById( _a.getAttribute('data-video-play') ).play()
	      },
	      
	      pause: function( _a )
	      {
  	      if( _a.hasAttribute('data-video-pause') )
  	        document.getElementById( _a.getAttribute('data-video-pause') ).pause()
	      }
	      
	    },
	    
	    goldstars: {
	      
	      check: function( _a )
	      {
	        pa.slides.features.goldstars.start( _a )
	        pa.slides.features.goldstars.reset( _a )
	      },
	      
	      start: function( _a )
	      {
	        if( _a.hasAttribute('data-goldstarstart') )
	          document.getElementById('goldstarstart').beginElement()
	      },
	      
	      reset: function( _a )
	      {
	        if( _a.hasAttribute('data-goldstarreset') )
	          document.getElementById('goldstarreset').beginElement()
	      }
	      
	    },
	    
	    goldbars: {
	      
	      check: function( _a )
	      {
	        pa.slides.features.goldbars.start( _a )
	        pa.slides.features.goldbars.reset( _a )
	      },
	      
	      start: function( _a )
	      {
	        if( _a.hasAttribute('data-goldbarstart') )
	          document.getElementById('goldbarstart').beginElement()
	      },
	      
	      reset: function( _a )
	      {
	        if( _a.hasAttribute('data-goldbarreset') )
	          document.getElementById('goldbarreset').beginElement()
	      }
	      
	    },
	    
	    skip: function( _a )
	    {
	      if( _a.hasAttribute('data-skip') )
	        pa.slides.skip = setTimeout( pa.slides.fwd.next, _a.getAttribute('data-skip'))
	    }
	    
	  }
	  
	},
	
	overview: {
	  
	  o: document.getElementById('overview'),
	  s: document.getElementById('overview-scroll'),
	  
	  init: function(){
	    bean.on( pa.overview.s, 'click', 'img', pa.overview.click )
      bean.on( pa.overview.o, 'click', pa.overview.close )
	  },
	  
	  click: function( _e )
	  {
	    var t = _e.target
	    pa.slides.setup( t.getAttribute('data-href') )
	    pa.overview.close()
	  },
	  
	  close: function()
	  {
	    pa.nav.goTo( 'slides' )
	  }
	  
	},
	
	nav: {
	  
	  n: document.getElementById('nav'),
	  
	  init: function(){
	    var l = pa.nav.n.querySelectorAll('.nav-link')
	    bean.on( pa.nav.n, 'click', '.nav-link', pa.nav.click )
//	    bean.on( document.getElementById('nav-overview'), 'click', pa.nav.click )
	  },
	  
	  click: function( _e )
	  {
	    var t = _e.target
	    pa.nav.goTo( t.getAttribute('data-href') )
	  },
	  
	  goTo: function( _s ){
	    if( _s )
	      document.documentElement.setAttribute('data-section', _s)
	  },
	  
	  setColor: function( _c )
	  {
	    switch( _c ){
        case 'negative': pa.nav.n.setAttribute('data-color', 'negative'); break
        default:
	      case 'positive': pa.nav.n.setAttribute('data-color', 'positive'); break
	    }
	  }
	  
	},
	
	images: {
	  
	  xs:  180,
	  sm:  360,
	  md:  720,
	  lg: 1440,
	  
	  src: 'xs',
	  
	  init: function()
	  {
	    var vp = eina.vp(),
	        i = document.querySelectorAll('img[data-rsp]'),
	        r = eina.retina(),
	        s
        
      if( vp.w > pa.images.md )
        s = 'lg'
      else if( vp.w > pa.images.sm )
        s = r ? 'lg' : 'md'
      else if( vp.w > pa.images.xs )
        s = r ? 'md' : 'sm'
      else
        s = r ? 'sm' : 'xs'
      
	    if( s != 'xs' ){
	      s = 'data-'+ s
  	    for( var j = 0; j < i.length; j++ ){
  	      pa.images.setSize( i[j], s )
  	    }
  	  }
	  },
	  
	  setSize: function( _i, _s )
	  {
	    _i.src = _i.getAttribute( _s )
	  }
	  
	}
	
}


domready( pa.init) // Document loaded, DOM ready
