-- roles
INSERT IGNORE INTO roles (id, role_name) VALUES (1, 'ROLE_GENERAL');
INSERT IGNORE INTO roles (id, role_name) VALUES (2, 'ROLE_ADMIN');

--user
INSERT IGNORE INTO user (id, name, email, password, role_id, enabled) VALUES (1, '侍 太郎', 'taro.samurai@example.com', '$2a$10$2JNjTwZBwo7fprL2X4sv.OEKqxnVtsVQvuXDkI8xVGix.U3W5B7CO', 1,true);
INSERT IGNORE INTO user (id, name, email, password, role_id, enabled) VALUES (2, '侍 花子', 'hanako.samurai@example.com', '$2a$10$2JNjTwZBwo7fprL2X4sv.OEKqxnVtsVQvuXDkI8xVGix.U3W5B7CO', 2,true);
INSERT IGNORE INTO user (id, name, email, password, role_id, enabled) VALUES (3, '侍 義勝', 'yoshikatsu.samurai@example.com', '$2a$10$2JNjTwZBwo7fprL2X4sv.OEKqxnVtsVQvuXDkI8xVGix.U3W5B7CO', 2,true);
INSERT IGNORE INTO user (id, name, email, password, role_id, enabled) VALUES (4, '侍 幸美', 'sachimi.samurai@example.com', 'password', 1, true);
INSERT IGNORE INTO user (id, name, email, password, role_id, enabled) VALUES (5, '侍 雅', 'miyabi.samurai@example.com', 'password', 1, false);
INSERT IGNORE INTO user (id, name, email, password, role_id, enabled) VALUES (6, '侍 正保',  'masayasu.samurai@example.com', 'password', 1, false);
INSERT IGNORE INTO user (id, name, email, password, role_id, enabled) VALUES (7, '侍 真由美',  'mayumi.samurai@example.com', 'password', 1, false);
INSERT IGNORE INTO user (id, name, email, password, role_id, enabled) VALUES (8, '侍 安民',  'yasutami.samurai@example.com', 'password', 1, false);
INSERT IGNORE INTO user (id, name, email, password, role_id, enabled) VALUES (9, '侍 章緒',  'akio.samurai@example.com', 'password', 1, false);
INSERT IGNORE INTO user (id, name, email, password, role_id, enabled) VALUES (10, '侍 祐子','yuko.samurai@example.com', 'password', 1, false);
INSERT IGNORE INTO user (id, name, email, password, role_id, enabled) VALUES (11, '侍 秋美','akimi.samurai@example.com', 'password', 1, false);
INSERT IGNORE INTO user (id, name, email, password, role_id, enabled) VALUES (12, '侍 信平', 'shinpei.samurai@example.com', 'password', 1, false);

--カテゴリー
insert ignore into category(id,name) values(1,"パーク"); 
insert ignore into category(id,name) values(2,"ローカル"); 
insert ignore into category(id,name) values(3,"ダウンヒル"); 
insert ignore into category(id,name) values(4,"ディッチ"); 
insert ignore into category(id,name) values(5,"トランジション"); 
insert ignore into category(id,name) values(6,"プール"); 
insert ignore into category(id,name) values(7,"フラットレール"); 
insert ignore into category(id,name) values(8,"ハーフパイプ"); 
insert ignore into category(id,name) values(9,"ストリート"); 
insert ignore into category(id,name) values(10,"レッジ"); 
insert ignore into category(id,name) values(11,"レールバー"); 
insert ignore into category(id,name) values(12,"クルージング"); 
insert ignore into category(id,name) values(13,"ショップ"); 

--スポット
insert ignore into spot(id,name,user_id,price,category_id,description,evalues,evalues_double,lat,lng) values (1,"スケボー1",1,1000,1,"いい滑り場所です",3,3.0,34.87893209582957,137.08163784840073);
insert ignore into spot(id,name,user_id,price,category_id,description,evalues,evalues_double,lat,lng) values (2,"スケボー2",1,500,1,"いい滑り場所です",3,3.0,34.955036393705676, 137.15558409345093);
insert ignore into spot(id,name,user_id,price,category_id,description,evalues,evalues_double,lat,lng) values (3,"スケボー3",5,800,2,"いい滑り場所です",3,3.0,34.915038769802436, 136.88355443042195);
insert ignore into spot(id,name,user_id,price,category_id,description,evalues,evalues_double,lat,lng) values (4,"スケボー4",5,900,3,"いい滑り場所です",3,3.0,34.83902031955612, 137.23026432630633);
insert ignore into spot(id,name,user_id,price,category_id,description,evalues,evalues_double,lat,lng) values (5,"スケボー5",5,200,3,"いい滑り場所です",3,3.0,35.28805153210608, 136.90638604566135);
insert ignore into spot(id,name,user_id,price,category_id,description,evalues,evalues_double,lat,lng) values (6,"スケボー6",5,300,3,"いい滑り場所です",3,3.0,35.22272929367598, 136.8068647104018);
insert ignore into spot(id,name,user_id,price,category_id,description,evalues,evalues_double,lat,lng) values (7,"スケボー7",4,500,4,"いい滑り場所です",3,3.0,34.85801011868572, 136.9669073736247);
insert ignore into spot(id,name,user_id,price,category_id,description,evalues,evalues_double,lat,lng) values (8,"スケボー8",4,1000,2,"いい滑り場所です",3,3.0,35.2685017034705, 136.98986828366222);
insert ignore into spot(id,name,user_id,price,category_id,description,evalues,evalues_double,lat,lng) values (9,"スケボー9",5,800,5,"いい滑り場所です",3,3.0,35.17671985344262, 136.90780159978308);
insert ignore into spot(id,name,user_id,price,category_id,description,evalues,evalues_double,lat,lng) values (10,"スケボー10",5,700,13,"いい滑り場所です",3,3.0,34.9277915479363, 137.13888017527503);
insert ignore into spot(id,name,user_id,price,category_id,description,evalues,evalues_double,lat,lng) values (11,"スケボー11",5,600,13,"いい滑り場所です",3,3.0,35.16280261444819, 136.90617541505003);

--レビュー
insert ignore into review(id,user_id,spot_id,evalues,contents) values(1,1,1,3,"良い"); 
insert ignore into review(id,user_id,spot_id,evalues,contents) values(2,2,1,3,"良い"); 
insert ignore into review(id,user_id,spot_id,evalues,contents) values(3,3,1,3,"良い"); 
insert ignore into review(id,user_id,spot_id,evalues,contents) values(4,4,1,3,"良い"); 
insert ignore into review(id,user_id,spot_id,evalues,contents) values(5,5,1,3,"良い"); 
insert ignore into review(id,user_id,spot_id,evalues,contents) values(6,6,1,3,"良い"); 
insert ignore into review(id,user_id,spot_id,evalues,contents) values(7,7,1,3,"良い"); 
insert ignore into review(id,user_id,spot_id,evalues,contents) values(8,8,1,3,"良い"); 
insert ignore into review(id,user_id,spot_id,evalues,contents) values(9,9,1,3,"良い"); 
insert ignore into review(id,user_id,spot_id,evalues,contents) values(10,10,1,3,"良い"); 
insert ignore into review(id,user_id,spot_id,evalues,contents) values(11,11,1,3,"良い"); 
insert ignore into review(id,user_id,spot_id,evalues,contents) values(12,12,1,3,"良い"); 
