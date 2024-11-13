-- roles
INSERT IGNORE INTO roles (id, role_name) VALUES (1, 'ROLE_GENERAL');
INSERT IGNORE INTO roles (id, role_name) VALUES (2, 'ROLE_ADMIN');

--user
INSERT IGNORE INTO user (id, name, email, password, role_id, enabled) VALUES (1, 'haru', 'taro.samurai@example.com', '$2a$10$2JNjTwZBwo7fprL2X4sv.OEKqxnVtsVQvuXDkI8xVGix.U3W5B7CO', 1,true);
INSERT IGNORE INTO user (id, name, email, password, role_id, enabled) VALUES (2, 'nori', 'hanako.samurai@example.com', '$2a$10$2JNjTwZBwo7fprL2X4sv.OEKqxnVtsVQvuXDkI8xVGix.U3W5B7CO', 1,true);
INSERT IGNORE INTO user (id, name, email, password, role_id, enabled) VALUES (3, 'shungo', 'yoshikatsu.samurai@example.com', '$2a$10$2JNjTwZBwo7fprL2X4sv.OEKqxnVtsVQvuXDkI8xVGix.U3W5B7CO', 1,true);
INSERT IGNORE INTO user (id, name, email, password, role_id, enabled) VALUES (4, 'kento', 'test@test', '$2a$10$2JNjTwZBwo7fprL2X4sv.OEKqxnVtsVQvuXDkI8xVGix.U3W5B7CO', 1,true);
INSERT IGNORE INTO user (id, name, email, password, role_id, enabled) VALUES (5, 'catfish', 'admin', '$2a$10$2JNjTwZBwo7fprL2X4sv.OEKqxnVtsVQvuXDkI8xVGix.U3W5B7CO', 2,true);
INSERT IGNORE INTO user (id, name, email, password, role_id, enabled) VALUES (6, 'visible', 'admin', '$2a$10$2JNjTwZBwo7fprL2X4sv.OEKqxnVtsVQvuXDkI8xVGix.U3W5B7CO', 1,true);

--カテゴリー
insert ignore into category(id,name) values(1,'パーク'); 
insert ignore into category(id,name) values(2,'ローカル'); 
insert ignore into category(id,name) values(3,'ダウンヒル'); 
insert ignore into category(id,name) values(4,'ディッチ'); 
insert ignore into category(id,name) values(5,'トランジション'); 
insert ignore into category(id,name) values(6,'プール'); 
insert ignore into category(id,name) values(7,'フラットレール'); 
insert ignore into category(id,name) values(8,'ハーフパイプ'); 
insert ignore into category(id,name) values(9,'ストリート'); 
insert ignore into category(id,name) values(10,'レッジ'); 
insert ignore into category(id,name) values(11,'レールバー'); 
insert ignore into category(id,name) values(12,'クルージング'); 
insert ignore into category(id,name) values(13,'ショップ');



--レビュー

insert ignore into review(id,user_id,spot_id,evalues,contents) values(2,2,1,3,'良い'); 


--MESSAGE FROM USER--
insert ignore into message_from_user_category(id,name) values(1,'サイトへの要望'); 
insert ignore into message_from_user_category(id,name) values(2,'スポットの通報'); 

--message from admin test message--
INSERT IGNORE INTO message_from_admin (id, user_id, title, contents, already_read) VALUES (1, 13, 'test1', 'test-contents', 0);
INSERT IGNORE INTO message_from_admin (id, user_id, title, contents, already_read) VALUES (2, 13, 'test2', 'test-contents', 0);
INSERT IGNORE INTO message_from_admin (id, user_id, title, contents, already_read) VALUES (3, 13, 'test3', 'test-contents', 0);
INSERT IGNORE INTO message_from_admin (id, user_id, title, contents, already_read) VALUES (4, 13, 'test4', 'test-contents', 0);
INSERT IGNORE INTO message_from_admin (id, user_id, title, contents, already_read) VALUES (5, 13, 'test5', 'test-contents', 0);
INSERT IGNORE INTO message_from_admin (id, user_id, title, contents, already_read) VALUES (6, 13, 'test6', 'test-contents', 0);
INSERT IGNORE INTO message_from_admin (id, user_id, title, contents, already_read) VALUES (7, 13, 'test7', 'test-contents', 0);
INSERT IGNORE INTO message_from_admin (id, user_id, title, contents, already_read) VALUES (8, 13, 'test8', 'test-contents', 0);
INSERT IGNORE INTO message_from_admin (id, user_id, title, contents, already_read) VALUES (9, 13, 'test9', 'test-contents', 0);
INSERT IGNORE INTO message_from_admin (id, user_id, title, contents, already_read) VALUES (10, 13, 'test10', 'test-contents', 0);
INSERT IGNORE INTO message_from_admin (id, user_id, title, contents, already_read) VALUES (11, 13, 'test11', 'test-contents', 0);
INSERT IGNORE INTO message_from_admin (id, user_id, title, contents, already_read) VALUES (12, 13, 'test12', 'test-contents', 0);
INSERT IGNORE INTO message_from_admin (id, user_id, title, contents, already_read) VALUES (13, 13, 'test13', 'test-contents', 0);
INSERT IGNORE INTO message_from_admin (id, user_id, title, contents, already_read) VALUES (14, 13, 'test14', 'test-contents', 0);
INSERT IGNORE INTO message_from_admin (id, user_id, title, contents, already_read) VALUES (15, 13, 'test15', 'test-contents', 0);
INSERT IGNORE INTO message_from_admin (id, user_id, title, contents, already_read) VALUES (16, 13, 'test16', 'test-contents', 0);
INSERT IGNORE INTO message_from_admin (id, user_id, title, contents, already_read) VALUES (17, 13, 'test17', 'test-contents', 0);
INSERT IGNORE INTO message_from_admin (id, user_id, title, contents, already_read) VALUES (18, 13, 'test18', 'test-contents', 0);
INSERT IGNORE INTO message_from_admin (id, user_id, title, contents, already_read) VALUES (19, 13, 'test19', 'test-contents', 0);
INSERT IGNORE INTO message_from_admin (id, user_id, title, contents, already_read) VALUES (20, 13, 'test20', 'test-contents', 0);
INSERT IGNORE INTO message_from_admin (id, user_id, title, contents, already_read) VALUES (21, 13, 'test21', 'test-contents', 0);
INSERT IGNORE INTO message_from_admin (id, user_id, title, contents, already_read) VALUES (22, 13, 'test22', 'test-contents', 0);
INSERT IGNORE INTO message_from_admin (id, user_id, title, contents, already_read) VALUES (23, 13, 'test23', 'test-contents', 0);
INSERT IGNORE INTO message_from_admin (id, user_id, title, contents, already_read) VALUES (24, 13, 'test24', 'test-contents', 0);
INSERT IGNORE INTO message_from_admin (id, user_id, title, contents, already_read) VALUES (25, 13, 'test25', 'test-contents', 0);
INSERT IGNORE INTO message_from_admin (id, user_id, title, contents, already_read) VALUES (26, 13, 'test26', 'test-contents', 0);
INSERT IGNORE INTO message_from_admin (id, user_id, title, contents, already_read) VALUES (27, 13, 'test27', 'test-contents', 0);
INSERT IGNORE INTO message_from_admin (id, user_id, title, contents, already_read) VALUES (28, 13, 'test28', 'test-contents', 0);
INSERT IGNORE INTO message_from_admin (id, user_id, title, contents, already_read) VALUES (29, 13, 'test29', 'test-contents', 0);
INSERT IGNORE INTO message_from_admin (id, user_id, title, contents, already_read) VALUES (30, 13, 'test30', 'test-contents', 0);

--スポット--
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (1, 'testspot1', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 45.241619552982264, 147.02156577552785, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (2, 'testspot2', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 45.125489055963804, 146.18403645977872, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (3, 'testspot3', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 44.90987742264118, 147.17838406823878, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (4, 'testspot4', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 45.2809708452621, 145.710546482352, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (5, 'testspot5', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 44.53844329102714, 145.90068455181583, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (6, 'testspot6', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 44.77671306886856, 145.88739441353505, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (7, 'testspot7', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 45.31428269481411, 146.5122500275556, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (8, 'testspot8', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 44.6226149843239, 147.3391274740072, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (9, 'testspot9', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 44.16468416188992, 146.74385367127368, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (10, 'testspot10', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 44.77247691008425, 147.1441163302945, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (11, 'testspot11', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 44.77145751859492, 145.86996353321558, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (12, 'testspot12', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 45.442780160722556, 145.8808473838626, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (13, 'testspot13', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 45.33739147090825, 147.4255464057351, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (14, 'testspot14', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 45.43887448464247, 147.41083028730304, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (15, 'testspot15', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 43.69645478795288, 146.177457869287, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (16, 'testspot16', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 45.10847875273274, 147.14912924083532, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (17, 'testspot17', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 43.517929133051524, 145.7109665610327, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (18, 'testspot18', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 44.82821288991042, 145.86326288967405, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (19, 'testspot19', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 44.7001725319522, 146.545906864951, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (20, 'testspot20', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 44.79619129580833, 145.65184156834408, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (21, 'testspot21', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 45.060694525532064, 146.08134954898534, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (22, 'testspot22', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 44.498669938631664, 146.73047466314395, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (23, 'testspot23', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 44.28720176111817, 146.82463072294522, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (24, 'testspot24', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 43.59302584546202, 146.0610785848228, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (25, 'testspot25', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 44.75634193472042, 147.07641732754914, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (26, 'testspot26', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 44.79387830944392, 145.61196646951487, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (27, 'testspot27', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 43.57663374692487, 147.29631468001418, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (28, 'testspot28', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 45.07854144988286, 145.56172373854326, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (29, 'testspot29', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 44.37656022446146, 147.43880247682048, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (30, 'testspot30', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 43.643587437091504, 146.66607909808758, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (31, 'testspot31', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 44.018289804212124, 146.85161390036367, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (32, 'testspot32', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 44.427534853066014, 147.13663117675182, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (33, 'testspot33', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 45.40139389963381, 145.54717973213423, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (34, 'testspot34', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 45.33064785257696, 147.49810472742652, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (35, 'testspot35', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 43.74122276615871, 146.34776471752983, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (36, 'testspot36', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 43.72891361642987, 147.02947076114364, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (37, 'testspot37', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 43.66577641204883, 146.45320039280287, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (38, 'testspot38', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 45.25421306273293, 145.86852112805684, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (39, 'testspot39', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 43.858264978360154, 146.99646279913148, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (40, 'testspot40', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 44.54511501320317, 145.6948637658182, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (41, 'testspot41', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 43.80251591930559, 145.77462054165034, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (42, 'testspot42', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 43.957466550234976, 146.08240622317314, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (43, 'testspot43', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 43.94545951260954, 147.42945374710558, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (44, 'testspot44', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 43.50133354292673, 145.55614102229623, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (45, 'testspot45', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 44.31633790474292, 147.35806490969705, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (46, 'testspot46', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 44.814589320825995, 146.14445670551797, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (47, 'testspot47', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 44.87707767644403, 145.97226942330954, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (48, 'testspot48', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 44.935700805930836, 146.4899528642293, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (49, 'testspot49', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 45.05470045123643, 146.63824501792843, true, false);
INSERT IGNORE INTO spot(id, name, user_id, price, category_id, description, evalues, evalues_double, lat, lng, enable, is_rejected) VALUES (50, 'testspot50', 1, 1000, 1, 'いい滑り場所です', 3, 3.0, 44.77887595516798, 147.38703624153072, true, false);


