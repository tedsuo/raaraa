user = User.fetchCurrentUser();

db.photos.find({user_id:{$in: user.friends}})
          .limit(pics_per_page)
          .skip(current_page * pics_per_page);
          
          
img_path+user_id+secret+timestamp