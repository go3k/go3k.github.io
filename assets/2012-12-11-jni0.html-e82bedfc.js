import{_ as a}from"./plugin-vue_export-helper-c27b6911.js";import{r as t,o as l,c as d,a as n,b as i,e as s,d as o,f as r}from"./app-c703f97d.js";const v={},c=n("h1",{id:"主体思路",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#主体思路","aria-hidden":"true"},"#"),i(" 主体思路")],-1),u=n("p",null,"通过JNI获取java虚拟机，再获取当前程序的JNI环境，通过JNI环境获取需要调用的java类信息，再获取需要调用的java类中的函数信息。再通过JNI环境调用，使用类信息、函数信息，调用对应的java函数。",-1),m={href:"http://cocos2d-x.org",target:"_blank",rel:"noopener noreferrer"},b=r(`<h1 id="jnihelper类的使用" tabindex="-1"><a class="header-anchor" href="#jnihelper类的使用" aria-hidden="true">#</a> JniHelper类的使用</h1><p>加入如下头文件： <code>#include &quot;platform/android/jni/JniHelper.h&quot;</code></p><p>需要使用的接口如下：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>    <span class="token keyword">static</span> bool <span class="token function">getStaticMethodInfo</span><span class="token punctuation">(</span><span class="token class-name">JniMethodInfo</span> <span class="token operator">&amp;</span>methodinfo<span class="token punctuation">,</span> <span class="token keyword">const</span> <span class="token keyword">char</span> <span class="token operator">*</span>className<span class="token punctuation">,</span> <span class="token keyword">const</span> <span class="token keyword">char</span> <span class="token operator">*</span>methodName<span class="token punctuation">,</span> <span class="token keyword">const</span> <span class="token keyword">char</span> <span class="token operator">*</span>paramCode<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">static</span> bool <span class="token function">getMethodInfo</span><span class="token punctuation">(</span><span class="token class-name">JniMethodInfo</span> <span class="token operator">&amp;</span>methodinfo<span class="token punctuation">,</span> <span class="token keyword">const</span> <span class="token keyword">char</span> <span class="token operator">*</span>className<span class="token punctuation">,</span> <span class="token keyword">const</span> <span class="token keyword">char</span> <span class="token operator">*</span>methodName<span class="token punctuation">,</span> <span class="token keyword">const</span> <span class="token keyword">char</span> <span class="token operator">*</span>paramCode<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>实现上我们只需要使用上面这两个接口，就可以获取java类的所有函数信息了。JNI环境的获取、各种错误处理都已经在这两个接口实现中封装好了。</p><p>先上代码，再来依次讲解每个参数的意义和使用方法：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>	  <span class="token comment">//函数信息结构体</span>
	  <span class="token class-name">JniMethodInfo</span> minfo<span class="token punctuation">;</span>
	  bool isHave <span class="token operator">=</span> <span class="token class-name">JniHelper</span><span class="token operator">::</span><span class="token function">getStaticMethodInfo</span><span class="token punctuation">(</span>minfo<span class="token punctuation">,</span><span class="token comment">/*JniMethodInfo的引用*/</span>
	                                               <span class="token string">&quot;com/omega/MyApp&quot;</span><span class="token punctuation">,</span><span class="token comment">/*类的路径*/</span>
	                                               <span class="token string">&quot;getJavaActivity&quot;</span><span class="token punctuation">,</span><span class="token comment">/*函数名*/</span>
	                                               <span class="token string">&quot;()Ljava/lang/Object;&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">/*函数类型简写*/</span>
	  jobject activityObj<span class="token punctuation">;</span>
	  <span class="token keyword">if</span> <span class="token punctuation">(</span>isHave<span class="token punctuation">)</span>
	  <span class="token punctuation">{</span>
	      <span class="token comment">//CallStaticObjectMethod调用java函数，并把返回值赋值给activityObj</span>
	      activityObj <span class="token operator">=</span> minfo<span class="token punctuation">.</span>env<span class="token operator">-&gt;</span><span class="token class-name">CallStaticObjectMethod</span><span class="token punctuation">(</span>minfo<span class="token punctuation">.</span>classID<span class="token punctuation">,</span> minfo<span class="token punctuation">.</span>methodID<span class="token punctuation">)</span><span class="token punctuation">;</span>
	  <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>OK，很简单。上面的代码，就是使用JNI在C++中调用java类静态函数的典型使用方法。只有两步：</p><ul><li><ol><li>获取java函数的信息，classid、methodid等等</li></ol></li><li><ol start="2"><li>选择JNIEnv中的接口，进行函数调用</li></ol></li></ul><h1 id="getstaticmethodinfo参数详解" tabindex="-1"><a class="header-anchor" href="#getstaticmethodinfo参数详解" aria-hidden="true">#</a> getStaticMethodInfo参数详解</h1><p>两个接口的参数一样，意义也相同，详解如下：</p><ol><li><code>JniMethodInfo &amp;methodinfo JniMethodInfo</code>对象的引用，函数执行中会把<code>jniEvn、classid、methodid</code>写入到引用中。</li><li><code>const char *className</code>类的路径，把类的完整包名写全，用法如以上代码。</li><li><code>const char *methodName</code>函数名，函数名写上就行了。</li></ol><p><code>const char *paramCode</code>函数类型简写</p><p>这个参数需要单独介绍，它的格式为：(参数)返回类型。<br> 例如：无参数，void返回类型函数，其简写为 ()V</p><h2 id="java中的类型对应的简写如下" tabindex="-1"><a class="header-anchor" href="#java中的类型对应的简写如下" aria-hidden="true">#</a> java中的类型对应的简写如下：</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>参数类型 -&gt; 参数简写
	boolean -&gt; Z
	byte -&gt; B
	char -&gt; C
	short -&gt; S
	int -&gt; I
	long -&gt; J
	float -&gt; F
	double -&gt; D
	void -&gt; V
	Object -&gt; Ljava/lang/String; L用/分割类的完整路径
	Array -&gt; [Ljava/lang/String; [签名 [I
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="多参数的函数" tabindex="-1"><a class="header-anchor" href="#多参数的函数" aria-hidden="true">#</a> 多参数的函数</h3><p>如果函数有多个参数，直接把简写并列即可。注意Object与Array型参数简写结尾的分号，示例：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>	IIII //4个int型参数的函数
	ILjava/lang/String;I //整形，string类型，整形组合 (int x, String a, int y)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="通过jnienv进行函数调用" tabindex="-1"><a class="header-anchor" href="#通过jnienv进行函数调用" aria-hidden="true">#</a> 通过JNIEnv进行函数调用</h1><p>JNIEvn有一系列的CallStatic[返回类型]Method、Call[返回类型]Method接口，需要针对不同的函数返回类型选择调用。 [返回类型]以函数返回类型的不同，对应不同的函数名。 例如：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>	CallStaticVoidMethod ---------void
	CallVoidMethod ---------void
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>其对应关系如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>函数名 -&gt; 函数返回值类型
	Void -&gt; void
	Object -&gt; jobject
	Boolean -&gt; jboolean
	Byte -&gt; jbyte
	Char -&gt; jchar
	Short -&gt; jshort
	Int -&gt; jint
	Long -&gt; jlong
	Float -&gt; jfloat
	Double -&gt; jdouble
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="参数传递" tabindex="-1"><a class="header-anchor" href="#参数传递" aria-hidden="true">#</a> 参数传递</h2><p>调用有参数的java函数时，需要把对应的参数传递进去。需要把参数按顺序加入到classid、methodid后面，并且需要做类型转换。例如：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>    jint jX = 10;
    jint jY = 10;
    minfo.env-&gt;CallStaticVoidMethod(minfo.classID, minfo.methodID, jX, jY);

参数类型转换关系如下：
	C++类型  -&gt; java类型
	boolean -&gt; jboolean
	byte -&gt; jbyte
	char -&gt; jchar
	short -&gt; jshort
	int -&gt; jint
	long -&gt; jlong
	float -&gt; jfloat
	double -&gt; jdouble
	Object -&gt; jobject
	Class -&gt; jclass
	String -&gt; jstring
	Object[] -&gt; jobjectArray
	boolean[] -&gt; jbooleanArray
	byte[] -&gt; jbyteArray
	char[] -&gt; jcharArray
	short[] -&gt; jshortArray
	int[] -&gt; jintArray
	long[] -&gt; jlongArray
	float[] -&gt; jfloatArray
	double[] -&gt; jdoubleArray
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="string类型的转换" tabindex="-1"><a class="header-anchor" href="#string类型的转换" aria-hidden="true">#</a> string类型的转换</h2><p>实际上我们最常用的参数类型，主要是内建的数据类型、string字符串类型。数据类型可以直接转为j类型，但是string类型需要做如下处理：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>    jstring jmsg = minfo.env-&gt;NewStringUTF(&quot;http://www.baidu.com&quot;);
    minfo.env-&gt;CallStaticVoidMethod(minfo.classID, minfo.methodID, jmsg);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="非静态函数的调用" tabindex="-1"><a class="header-anchor" href="#非静态函数的调用" aria-hidden="true">#</a> 非静态函数的调用</h1><p>非静态函数的调用与静态函数的调用类型，但是需要通过一个静态函数获取java类对象。 示例：</p><div class="language-Cpp line-numbers-mode" data-ext="Cpp"><pre class="language-Cpp"><code>    //C++代码
    //1. 获取activity静态对象
    JniMethodInfo minfo;
    bool isHave = JniHelper::getStaticMethodInfo(minfo,
                                                 &quot;com/omega/MyApp&quot;,
                                                 &quot;getJavaActivity&quot;,
                                                 &quot;()Ljava/lang/Object;&quot;);
    jobject activityObj;
    if (isHave)
    {
        //调用静态函数getJavaActivity，获取java类对象。
        activityObj = minfo.env-&gt;CallStaticObjectMethod(minfo.classID, minfo.methodID);
    }
    //2. 查找displayWebView接口，获取其函数信息，并用jobj调用
    isHave = JniHelper::getMethodInfo(minfo,&quot;com/omega/MyApp&quot;,&quot;displayWebView&quot;, &quot;(IIII)V&quot;);
    if (!isHave)
    {
        CCLog(&quot;jni:displayWebView 函数不存在&quot;);
    }
    else
    {
        //调用此函数
        jint jX = (int)tlX;
        jint jY = (int)tlY;
        jint jWidth = (int)webWidth;
        jint jHeight = (int)webHeight;
        //调用displayWebView函数，并传入参数
        minfo.env-&gt;CallVoidMethod(activityObj, minfo.methodID, jX, jY, jWidth, jHeight);
    }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="详尽的示例代码" tabindex="-1"><a class="header-anchor" href="#详尽的示例代码" aria-hidden="true">#</a> 详尽的示例代码</h1><p>最后，放一块比较详细的JNI使用代码，基本上覆盖了的全部使用情况。</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>        JniMethodInfo minfo;//JniHelper   
        /* 测试用方法 */
        /*bool isHave = JniHelper::getStaticMethodInfo(minfo,&quot;com/cocoa/HiWorld&quot;,&quot;loginGree&quot;, &quot;()V&quot;); //
         if (isHave) {
         //CCLog(&quot;有showText &quot;);
         minfo.env -&gt; CallStaticVoidMethod(minfo.classID,minfo.methodID);
         }else
         {
         //CCLog(&quot;没有方法showText&quot;);
         }*/
        /* 分享 */
        /*//将c++中的string转换成java中的string
         //char str[] = &quot;test&quot;;
         bool isHave = JniHelper::getStaticMethodInfo(minfo,&quot;com/cocoa/HiWorld&quot;,&quot;shareSina&quot;, &quot;(Ljava/lang/String;Ljava/lang/String;)V&quot;); //
         if (isHave) {
         //CCLog(&quot;有share &quot;);
         jstring jstr = minfo.env-&gt;NewStringUTF(&quot;test1 share&quot;);
         jstring jst = minfo.env-&gt;NewStringUTF(&quot;/data/data/com.cocoa/cy.png&quot;);
         //jstring jst = minfo.env-&gt;NewStringUTF(&quot;&quot;);
         minfo.env -&gt; CallStaticVoidMethod(minfo.classID,minfo.methodID,jstr,jst);
         }else
         {
         //CCLog(&quot;没有方法share&quot;);
         }*/
        /* 设置高分 */
        /*jint ind = 0;
         jlong lsre = 2202l;
         bool isHave = JniHelper::getStaticMethodInfo(minfo,&quot;com/cocoa/HiWorld&quot;,&quot;setHighScore&quot;, &quot;(IJ)V&quot;);
         if (isHave) {
         minfo.env -&gt; CallStaticVoidMethod(minfo.classID,minfo.methodID,ind,lsre);            
         }*/
        /* 成就解锁 */
        /*jint aind = 0;
         bool isHave = JniHelper::getStaticMethodInfo(minfo,&quot;com/cocoa/HiWorld&quot;,&quot;unLock&quot;, &quot;(I)V&quot;);
         if (isHave) {
         minfo.env -&gt; CallStaticVoidMethod(minfo.classID,minfo.methodID,aind);            
         }*/
        /* 测试用方法 */
        bool isHave = JniHelper::getStaticMethodInfo(minfo,&quot;com/cocoa/HiWorld&quot;,&quot;rtnActivity&quot;,&quot;()Ljava/lang/Object;&quot;);
        jobject jobj;
        if (isHave) {
            jobj = minfo.env-&gt;CallStaticObjectMethod(minfo.classID, minfo.methodID);
        }       
        //CCLog(&quot; jobj存在&quot;);
        /* 测试用方法,非静态无参数无返回值方法 */
        /*isHave = JniHelper::getMethodInfo(minfo,&quot;com/cocoa/HiWorld&quot;,&quot;showText&quot;, &quot;()V&quot;);
         if (isHave) {
         minfo.env -&gt; CallVoidMethod(jobj,minfo.methodID);
         }*/
        /* 测试用方法,非静态有java类型的String参数无返回值方法 */
        /*isHave = JniHelper::getMethodInfo(minfo,&quot;com/cocoa/HiWorld&quot;,&quot;showText&quot;, &quot;(Ljava/lang/String;)V&quot;);
         if (isHave) {
         jstring jmsg = minfo.env-&gt;NewStringUTF(&quot;msg okey!&quot;);
         minfo.env -&gt; CallVoidMethod(jobj,minfo.methodID,jmsg);
         }*/
        /* 测试用方法，返回java类型的String，有java类型的String和int参数方法 */
        /*isHave = JniHelper::getMethodInfo(minfo,&quot;com/cocoa/HiWorld&quot;,&quot;showText&quot;, &quot;(Ljava/lang/String;I)Ljava/lang/String;&quot;);
         if (isHave) {
         jstring jmsg = minfo.env-&gt;NewStringUTF(&quot;msg okey! return string&quot;);
         jint index = 0;
         minfo.env -&gt; CallObjectMethod(jobj,minfo.methodID,jmsg,index);
         }*/
        /* 测试用方法，返回java类型的String[]，有java类型的String[]和int参数方法 */
        /*isHave = JniHelper::getMethodInfo(minfo,&quot;com/cocoa/HiWorld&quot;,&quot;showText&quot;, &quot;([Ljava/lang/String;I)[Ljava/lang/String;&quot;);
         if (isHave) {
         jobjectArray args = 0;
         jstring str;
         jsize len = 5;
         const char* sa[] = {&quot;Hi,&quot;,&quot;World!&quot;,&quot;JNI &quot;,&quot;is &quot;,&quot;fun&quot;};
         int i = 0;
         args = minfo.env-&gt;NewObjectArray(len,minfo.env-&gt;FindClass(&quot;java/lang/String&quot;),0);
         for(i=0;iNewStringUTF(sa[i]);
         minfo.env-&gt;SetObjectArrayElement(args,i,str);
         }
         //minfo.env-&gt;GetStringArrayRegion(args,0,10,buf);
         //jintArray jmsg = {1,2,3};
         //minfo.env-&gt;NewStringUTF(&quot;msg okey! return string&quot;);
         jint index = 0;
         minfo.env -&gt; CallObjectMethod(jobj,minfo.methodID,args,index);
         }*/
        /* 测试用方法，无返回类型，有java类型的int[]和int参数方法 */
        /*isHave = JniHelper::getMethodInfo(minfo,&quot;com/cocoa/HiWorld&quot;,&quot;testArr&quot;, &quot;([II)V&quot;);
         if (isHave) {
         jint buf[]={7,5,8,9,3};
         jintArray jintArr; //定义jint数组
         jintArr = minfo.env-&gt;NewIntArray(5);
         minfo.env-&gt;SetIntArrayRegion(jintArr,0,5,buf);
         jint index = 0;
         minfo.env -&gt; CallVoidMethod(jobj,minfo.methodID,jintArr,index);
         }*/
        /* 测试用方法，无返回类型，有java类型的byte[]和int参数方法 */
        isHave = JniHelper::getMethodInfo(minfo,&quot;com/cocoa/HiWorld&quot;,&quot;testArr&quot;, &quot;([BI)V&quot;);
        if (isHave) {
            jbyte buf[]={7,5,8,9,3};
            jbyteArray jbyteArr; //定义jbyte数组
            jbyteArr = minfo.env-&gt;NewByteArray(5);
            minfo.env-&gt;SetByteArrayRegion(jbyteArr,0,5,buf);
            jint index = 0;
            minfo.env -&gt; CallVoidMethod(jobj,minfo.methodID,jbyteArr,index);
        }
    private static HiWorld hiWorld = null;
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        hiWorld = this;
        if (detectOpenGLES20()) {
            // get the packageName,it&#39;s used to set the resource path
            String packageName = getApplication().getPackageName();
            super.setPackageName(packageName);
            // set content
            setContentView(R.layout.game_demo);
            getWindow().setFeatureInt(Window.FEATURE_CUSTOM_TITLE,
                                      R.layout.window_title);
            mGLView = (Cocos2dxGLSurfaceView) findViewById(R.id.game_gl_surfaceview);
            mGLView.setTextField((Cocos2dxEditText) findViewById(R.id.textField));
            mGLView.setEGLContextClientVersion(2);
            mGLView.setCocos2dxRenderer(new Cocos2dxRenderer());
            task = new TimerTask() {
                @Override
                public void run() {
                    // HiWorld.shoot(hiWorld);
                    Log.e(&quot;-------------------&quot;, &quot;-------------------&quot;);
                    // 调用c++中的方法
                    System.out.println(&quot;------------------------&quot;
                                       + stringZjy1());
                }
            };
            timer = new Timer();
            timer.schedule(task, 5000);
        } else {
            Log.d(&quot;activity&quot;, &quot;don&#39;t support gles2.0&quot;);
            finish();
        }
        static {
            System.loadLibrary(&quot;game&quot;);
        }
        // c++中調用的方法
        public static Object rtnActivity() {
            System.out.println(&quot;----------rtnActivity&quot;);
            return hiWorld;
        }
        // c++中調用的方法,传String类型
        public void showText(final String msg) {
            // 添加到主线程
            hiWorld.runOnUiThread(new Runnable() {
                public void run() {
                    System.out.println(&quot;----------msg:&quot;+msg);
                }
            });
        }
        //c++中調用的方法,传String类型和int类型
        public String showText(final String msg,final int index) {
            // 添加到主线程
            hiWorld.runOnUiThread(new Runnable() {
                public void run() {
                    System.out.println(&quot;----------msg:&quot;+msg+&quot;; index=&quot;+index);
                }
            });
            return &quot;okey String showText(final String msg,final int index)&quot;;
        }
        //c++中調用的方法,传String[]类型和int类型
        public String[] showText(final String[] msg,final int index) {
            String[] strArr = {&quot;1&quot;,&quot;2&quot;,&quot;3&quot;,&quot;4&quot;,&quot;5&quot;};
            // 添加到主线程
            hiWorld.runOnUiThread(new Runnable() {
                public void run() {
                    for(String _str:msg){
                        System.out.println(&quot;----------String[] msg:&quot;+_str+&quot;; index=&quot;+index);
                    }
                }
            });
            return strArr;
        }
        //c++中調用的方法,传int[]类型和int类型
        public void testArr(final int msg[],final int index) {
            // 添加到主线程
            hiWorld.runOnUiThread(new Runnable() {
                public void run() {
                    System.out.println(&quot;----------int[] msg len：&quot;+msg.length);
                    for(int _bl:msg){
                        System.out.println(&quot;----------int[] msg:&quot;+_bl+&quot;; index=&quot;+index);
                    }
                }
            });
        }
        //c++中調用的方法,传int[]类型和int类型
        public void testArr(final byte msg[],final int index) {
            // 添加到主线程
            hiWorld.runOnUiThread(new Runnable() {
                public void run() {
                    System.out.println(&quot;----------byte[] msg len：&quot;+msg.length);
                    for(int _bl:msg){
                        System.out.println(&quot;----------byte[] msg:&quot;+_bl+&quot;; index=&quot;+index);
                    }
                }
            });
        }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>参考文章：</p>`,37),p={href:"http://www.himigame.com/android-game/725.html",target:"_blank",rel:"noopener noreferrer"},g={href:"http://blog.csdn.net/kafei_kings/article/details/8106744",target:"_blank",rel:"noopener noreferrer"};function h(j,f){const e=t("ExternalLinkIcon");return l(),d("div",null,[c,u,n("p",null,[i("看起来好像有点复杂，but不用担心，cocos2d-x中有一个JniHelper类(头文件的copyright为："),n("a",m,[i("cocos2d-x.org"),s(e)]),i("，是Google提供的还是cocos2d-x小组自己封装的我就不清楚了)，它已经把这些工作封装好了。")]),o(" more "),b,n("p",null,[n("a",p,[i("Himi教程"),s(e)])]),n("p",null,[n("a",g,[i("CSDN博客"),s(e)])])])}const y=a(v,[["render",h],["__file","2012-12-11-jni0.html.vue"]]);export{y as default};
