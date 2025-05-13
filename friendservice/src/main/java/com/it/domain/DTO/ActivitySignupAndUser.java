package com.it.domain.DTO;

import com.it.domain.Activity;
import com.it.domain.ActivitySignup;
import com.it.domain.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

@Data
@NoArgsConstructor
public class ActivitySignupAndUser {

    private ActivitySignup activitySignup;

    private Activity activity;

    private UserDTO user;
    
    // 报名时间，方便前端显示
    private Date signupTime;

    public ActivitySignupAndUser(Activity activity, UserDTO user) {
        this.activity = activity;
        this.user = user;
    }

    public ActivitySignupAndUser(ActivitySignup activitySignup, UserDTO user) {
        this.activitySignup = activitySignup;
        this.user = user;
        this.signupTime = activitySignup.getCreatedAt(); // 设置报名时间
    }

    public ActivitySignupAndUser(ActivitySignup activitySignup, Activity activity, UserDTO user) {
        this.activitySignup = activitySignup;
        this.activity = activity;
        this.user = user;
        this.signupTime = activitySignup.getCreatedAt(); // 设置报名时间
    }
}
