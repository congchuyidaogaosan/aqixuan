import { createRouter } from '@gowiny/uni-router'
import PAGE_DATA from '@/pages.json';

// const token = uni.getStorageSync('token')
const router = createRouter({
    pageData:PAGE_DATA
})
 const whiteList = ['/pages/login/login'];
router.beforeEach((to,from)=>{
  // debugger
  if(whiteList.indexOf(to.path) == -1){
        if(uni.getStorageSync('token') ){
            // next();
            uni.navigateTo({
                url: to.path
            });
        }else{
            setTimeout(()=>{  //拦截后一直跳不过去，加上定时器后就好了
                uni.navigateTo({
                    url: '/pages/login/login'
                });
            },0)
        }
    }else{ // 白名单
        uni.navigateTo({
            url: to.path
        });
        
    }
})
 
export default router