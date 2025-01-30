package com.it.domain.DTO;

import com.it.domain.Activity;
import com.it.domain.ActivitySignup;
import com.it.domain.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ActivitySignupAndUser {

    private ActivitySignup activitySignup;

    private Activity activity;

    private User user;

    public ActivitySignupAndUser(Activity activity, User user) {
        this.activity = activity;
        this.user = user;
    }

    public ActivitySignupAndUser(ActivitySignup activitySignup, User user) {
        this.activitySignup = activitySignup;
        this.user = user;
    }

    public ActivitySignupAndUser(ActivitySignup activitySignup, Activity activity, User user) {
        this.activitySignup = activitySignup;
        this.activity = activity;
        this.user = user;
    }
}
