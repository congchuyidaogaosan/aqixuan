import { getRecommendUserList } from '@/api/user'
export default { 
	data(){
		return{
			number:5, //展示卡片数量，同时设置animationData对象
			moveRotate:{ x:0,y:0 }, //设置位移图片旋转角度距离  card中心点 - 指向坐标
			delMoveD: uni.getSystemInfoSync().screenHeight,//设置删除移动距离
			touchMoveD: 100,//设置card移动距离,   card移动距离/touchMoveD = 其他card变化比率
			rotate:0, //旋转deg 设置第2张卡片transform opacity
			scale:{ x:1,y:1 }, //缩放
			skew:{ x:0,y:0 }, //倾斜px
			translate:{ x:0,y:0 }, //位移px
			opacity:1,  //透明度，参数范围 0~1
			type:false, //是否拥有两套代码
			currentPage: 1, // 当前页码
			pageSize: 10, // 每页数量
			isLoading: false, // 是否正在加载数据
			
			moveX:0, //记录移动值
			moveY:0, //
			oldTouces:{},
			oldMove:{},
			touchAnimation:null,
			animationData:{}, 
			dataList:[],
			delTime:150,
			cardId:0,
			x:0,
			y:0,
			sysHeight:0,
			sysWidth:0,
			delFlag:false, //app下禁止快速滑动150ms
		}
	},
	created() {
		this.init()
		this.sysHeight = uni.getSystemInfoSync().windowHeight
		this.sysWidth = uni.getSystemInfoSync().windowWidth
	},
	async mounted() {
		this.createAnimation()
		this.getData()
	},
	methods:{
		//初始值设置
		init(){
			
		},
		//获取数据
		async getData(isAppend = false){
			// 如果正在加载中，直接返回
			if(this.isLoading) return;
			
			// 如果不是追加模式且已有数据，不重新加载
			if(!isAppend && this.dataList && this.dataList.length > 0) {
				return;
			}
			
			try {
				this.isLoading = true;
				const res = await getRecommendUserList(this.currentPage, this.pageSize)
				console.log(res)
				if(res && res.list.length > 0) {
					const formattedData = res.list.map(item => {
						console.log(item)
						const user = item.user;
						const interests = user.interests ? user.interests.split('、') : [];
						const sports = user.sports ? user.sports.split('、') : [];
						
						// 计算年龄
						const birthday = new Date(user.birthday);
						const today = new Date();
						const age = today.getFullYear() - birthday.getFullYear();
						
						return {
							_id: this.cardId++,
							userId: user.id,
							src: item.url?.[0] || '../../static/default-avatar.png',
							sex: user.gender || 0,
							address: user.location || '未知',
							name: user.nickname || '未知用户',
							constellation: this.getConstellation(birthday),
							img: item.url || ['../../static/default-avatar.png'],
							old: age,
							moveX: 0,
							moveY: 0,
							animation: false,
							introduction: user.introduction,
							height: user.height,
							weight: user.weight,
							roleType: user.roleType,
							industry: user.industry,
							emotionStatus: user.emotionStatus,
							mbti: user.mbti,
							datingPurpose: user.datingPurpose,
							interests: interests,
							sports: sports
						}
					})
					console.log(formattedData);
					if(isAppend) {
						// 将新数据追加到数组末尾，并确保_id是连续的
						this.dataList = [...this.dataList, ...formattedData].map((item, index) => ({
							...item,
							_id: index // 重新设置_id确保顺序正确
						}));
						console.log(this.dataList);
					} else {
						this.dataList = formattedData;
						console.log(this.dataList)
					}
					
					// 更新页码
					this.currentPage++;
					
				} else if(!isAppend) {
					// 只有在非追加模式下才使用默认数据
					this.dataList = [{
						_id: this.cardId++,
						userId: 0,
						src:'../../static/default-avatar.png',
						sex:1,
						address:'未知',
						name:'暂无推荐',
						constellation:'未知',
						img: ['../../static/default-avatar.png'],
						old:18,
						moveX: 0,
						moveY: 0,
						animation: false
					}]
				}
			} catch(e) {
				console.error('获取推荐用户列表失败:', e)
				if(!isAppend) {
					// 只有在非追加模式下才使用默认数据
					this.dataList = [{
						_id: this.cardId++,
						src:'../../static/default-avatar.png',
						sex:1,
						address:'未知',
						name:'暂无推荐',
						constellation:'未知',
						img: ['../../static/default-avatar.png'],
						old:18,
						moveX: 0,
						moveY: 0,
						animation: false
					}]
				}
			} finally {
				this.isLoading = false;
			}
		},
		// 根据生日计算星座
		getConstellation(birthday) {
			const month = birthday.getMonth() + 1;
			const day = birthday.getDate();
			
			if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return "水瓶座";
			if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return "双鱼座";
			if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return "白羊座";
			if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return "金牛座";
			if ((month == 5 && day >= 21) || (month == 6 && day <= 21)) return "双子座";
			if ((month == 6 && day >= 22) || (month == 7 && day <= 22)) return "巨蟹座";
			if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return "狮子座";
			if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return "处女座";
			if ((month == 9 && day >= 23) || (month == 10 && day <= 23)) return "天秤座";
			if ((month == 10 && day >= 24) || (month == 11 && day <= 22)) return "天蝎座";
			if ((month == 11 && day >= 23) || (month == 12 && day <= 21)) return "射手座";
			return "摩羯座";
		},
		createAnimation(){
			//touch移动动画
			this.touchAnimation = uni.createAnimation({
				duration:0
			});
			//其他卡片移动
			this.moveAnimation = uni.createAnimation({
				duration:0
			});
			//删除动画
			this.delanimation = uni.createAnimation({
				duration:this.delTime,
				
			});
			//删除时其他card动画
			this.endanimation = uni.createAnimation({
				duration:200
			});
		},
		touchStart(e){
		
			this.oldTouces = e.touches[0]
			
		},
		touchMove(e) {
			
			if(this.delFlag) return
			
			
			let { oldTouces } = this
			
			
			let newTouces = e.touches[0]
			//平移
			this.moveX = newTouces.clientX-oldTouces.clientX
			this.moveY = newTouces.clientY-oldTouces.clientY
			this.dataList[0].moveX = this.moveX
			this.dataList[0].moveY = this.moveY
			
			this.dataList[0].animation = false
			//移动图片旋转角度
			let angle = this.calcAngleDegrees(this.moveX- this.moveRotate.x,this.moveY- this.moveRotate.y )
			
			//移动card动画
			if(this.type){
				//#ifdef APP-PLUS
				this.touchAnimation.translateX(this.moveX).translateY(this.moveY).rotate(angle).step();
				//#endif
				//#ifndef APP-PLUS
				this.touchAnimation.rotate(angle).step();
				//#endif
			}else{
				this.touchAnimation.rotate(angle).step();
			}
			
			
			
			
			
			this.animationData[0] = this.touchAnimation.export()
			
			//其他card动画
			let d = this.moveX*this.moveX + this.moveY*this.moveY
			let ratio = Math.sqrt(d) / this.touchMoveD 
			ratio = ratio > 1 ? 1 : ratio
			
			for (var i = 1; i < this.number; i++) {
				
				if(this.rotate!=0) this.moveAnimation.rotate( this.rotate*(i-ratio) )
				if(this.opacity!=1) this.moveAnimation.opacity( 1-(1-this.opacity)*(i-ratio) )
				if(this.scale.x!=1) this.moveAnimation.scaleX( 1-(1-this.scale.x)*(i-ratio) )
				if(this.scale.y!=1) this.moveAnimation.scaleY( 1-(1-this.scale.y)*(i-ratio) )
				if(this.skew.x!=0) this.moveAnimation.skewX( this.skew.x*(i-ratio) )
				if(this.skew.y!=0) this.moveAnimation.skewY( this.skew.y*(i-ratio) )
				if(this.translate.x!=0) this.moveAnimation.translateX( this.translate.x*(i-ratio) )
				if(this.translate.y!=0) this.moveAnimation.translateY( this.translate.y*(i-ratio) )
				
				this.moveAnimation.step()
				this.animationData[i] = this.moveAnimation.export()
			}
			//触摸中视图变化
			this.moveJudge(this.moveX,this.moveY,ratio)
		},
		touchend(e){
			
			this.endJudge(this.moveX,this.moveY)
			
		},
		//触摸中判断
		moveJudge(x,y,ratio){
			
		},
		//触摸结束判断
		endJudge(x,y){
			if(x!=0||y!=0){
				this._del()
			}
		},
		//返回card
		_back(){
			
			let { oldMove } = this
			//移动图片旋转角度
			let angle = this.calcAngleDegrees(this.moveX- this.moveRotate.x,this.moveY- this.moveRotate.y )
			//移动card动画
			
			if(this.type){
				//#ifdef APP-PLUS
				this.delanimation.translateX(-this.moveX/3).translateY(-this.moveY/3).rotate(0).step();
				//#endif

			}else{
				
			}
			
			
			this.moveX = 0
			this.moveY = 0
			this.dataList[0].moveX = 0
			this.dataList[0].moveY = 0
			this.dataList[0].animation = true
			this.delanimation.translateX(this.moveX).translateY(this.moveY).rotate(0).step();
			this.animationData[0] = this.delanimation.export()
			setTimeout(() => {
				//清除动画
				this.animationData[0] = this.delanimation.export()
				for (var i = 1; i < this.number; i++) {
					this.animationData[i] = this.moveAnimation.export()
				}
				this.moveX = 0
				this.moveY = 0
			}, this.delTime)
			
			//其他card动画
			let ratio = 0
			
			for (var i = 1; i < this.number; i++) {
				
				if(this.rotate!=0) this.endanimation.rotate( this.rotate*(i-ratio) )
				if(this.opacity!=1) this.endanimation.opacity( 1-(1-this.opacity)*(i-ratio) )
				if(this.scale.x!=1) this.endanimation.scaleX( 1-(1-this.scale.x)*(i-ratio) )
				if(this.scale.y!=1) this.endanimation.scaleY( 1-(1-this.scale.y)*(i-ratio) )
				if(this.skew.x!=0) this.endanimation.skewX( this.skew.x*(i-ratio) )
				if(this.skew.y!=0) this.endanimation.skewY( this.skew.y*(i-ratio) )
				if(this.translate.x!=0) this.endanimation.translateX( this.translate.x*(i-ratio) )
				if(this.translate.y!=0) this.endanimation.translateY( this.translate.y*(i-ratio) )
				
				this.endanimation.step()
				this.animationData[i] = this.endanimation.export()
			}
		},
		//删除card
		_del(){
			if(this.type) {
				//#ifdef APP-PLUS
				this.delFlag = true
				//#endif
			}
			
			
			//移动card动画
			let d = this.moveX*this.moveX + this.moveY*this.moveY
			let y = this.moveY*this.delMoveD/Math.sqrt(d)
			let x = this.moveX*this.delMoveD/Math.sqrt(d)
			this.delanimation.translateX(x).translateY(y).step();
			this.animationData[0] = this.delanimation.export()
			setTimeout(() => {
				
				//清除动画
				this.animationData[0] = this.delanimation.export()
				for (var i = 1; i < this.number; i++) {
					this.animationData[i] = this.moveAnimation.export()
				}
				
				this.delCard(this.moveX,this.moveY)
				this.moveX = 0
				this.moveY = 0
				this.dataList[0].moveX = 0
				this.dataList[0].moveY = 0
				this.dataList.splice(0,1)
				
				// 当数据剩余2条时，提前加载下一页
				if(this.dataList.length <= 2) {
					this.getData(true)
				}
				
				if(this.type) {
					//#ifdef APP-PLUS
					this.delFlag = false
					//#endif
				}
			}, this.delTime)
			
			//其他card动画
			let ratio = 1
			
			for (var i = 1; i < this.number; i++) {
				
				if(this.rotate!=0) this.endanimation.rotate( this.rotate*(i-ratio) )
				if(this.opacity!=1) this.endanimation.opacity( 1-(1-this.opacity)*(i-ratio) )
				if(this.scale.x!=1) this.endanimation.scaleX( 1-(1-this.scale.x)*(i-ratio) )
				if(this.scale.y!=1) this.endanimation.scaleY( 1-(1-this.scale.y)*(i-ratio) )
				if(this.skew.x!=0) this.endanimation.skewX( this.skew.x*(i-ratio) )
				if(this.skew.y!=0) this.endanimation.skewY( this.skew.y*(i-ratio) )
				if(this.translate.x!=0) this.endanimation.translateX( this.translate.x*(i-ratio) )
				if(this.translate.y!=0) this.endanimation.translateY( this.translate.y*(i-ratio) )
				
				this.endanimation.step()
				this.animationData[i] = this.endanimation.export()
			}
		},
		delCard(){
			console.log(this.dataList[0])
		},
		calcAngleDegrees(x, y) {
			return Math.atan2(y, x) * 180 / Math.PI + 90;
		}
	},
	watch:{
			
			
			
	},
	watch:{
		number:{
			immediate:true,
			handler(newVal,oldVal){
				for (var i = 0; i < newVal; i++) {
					let a = {}
					a[i] = {}
					this.animationData = {...this.animationData,...a}
				}
			}
		},
		dataList:{
			handler(newVal,oldVal){
				for (let item of newVal) {
					if(!item._id){
						item._id = this.cardId++
						item.moveX = 0
						item.moveY = 0
						item.animation = false
					} 
				}
				
			}
		}
	}
}

