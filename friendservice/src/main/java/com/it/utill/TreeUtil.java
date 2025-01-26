package com.it.utill;

import com.it.domain.Moment;
import com.it.domain.MomentComment;
import com.it.domain.tree.MomentCommentTree;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

@Component
public class TreeUtil {


    public List<MomentCommentTree> createTree(List<MomentComment> commentList, int pid) {

        List<MomentCommentTree> commentTreeList =new ArrayList<>();
        for (MomentComment momentComment:commentList){
            MomentCommentTree vo = new MomentCommentTree();
            try {

                BeanUtils.copyProperties(momentComment,vo);
                commentTreeList.add(vo);
            }catch (IllegalAccessError | Exception e){
                e.printStackTrace();
            }
        }
        if (commentList.size()==1){
            return commentTreeList;
        }

        LinkedList<MomentCommentTree> momentComments = new LinkedList<>();



        for (MomentCommentTree commentTree : commentTreeList) {
            if (commentTree.getParentId() == pid) {
                commentTree.setMomentCommentTree(createTree(commentList, commentTree.getId()));
            }
        }
        return momentComments;
    }

}
