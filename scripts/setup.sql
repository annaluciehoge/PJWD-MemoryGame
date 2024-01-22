{\rtf1\ansi\ansicpg1252\cocoartf2759
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;\f1\fnil\fcharset0 Menlo-Regular;}
{\colortbl;\red255\green255\blue255;\red0\green0\blue0;\red255\green255\blue255;\red212\green213\blue153;
\red193\green193\blue193;\red71\green138\blue206;\red193\green193\blue193;\red88\green137\blue67;\red0\green0\blue0;
\red71\green138\blue206;\red193\green193\blue193;\red212\green213\blue153;\red194\green125\blue100;\red88\green137\blue67;
\red167\green197\blue151;\red203\green203\blue202;}
{\*\expandedcolortbl;;\cssrgb\c0\c1\c1;\cssrgb\c100000\c100000\c100000\c0;\cssrgb\c86247\c86215\c66392;
\cssrgb\c80176\c80176\c79976;\cssrgb\c34146\c61677\c84338;\cssrgb\c80000\c80000\c80000;\cssrgb\c41481\c59899\c33082;\cssrgb\c0\c1\c1;
\cssrgb\c34146\c61677\c84338;\cssrgb\c80176\c80176\c79976;\cssrgb\c86247\c86215\c66392;\cssrgb\c80772\c56796\c46790;\cssrgb\c41481\c59899\c33082;
\cssrgb\c71035\c80830\c65726;\cssrgb\c83320\c83320\c83112;}
\paperw11900\paperh16840\margl1440\margr1440\vieww17940\viewh8400\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs32 \cf0 -- main database\
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0
\cf0 CREATE DATABASE 
\f1 \cf2 \cb3 \expnd0\expndtw0\kerning0
IF NOT EXISTS\cf7 \cb1  
\f0 \cf0 \kerning1\expnd0\expndtw0 `memory_game_webdev_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;\
\
-- memory_game_webdev_db.Scores definition\
CREATE TABLE `Scores` (\
  `user_id` varchar(255) NOT NULL,\
  `score` int(11) DEFAULT NULL,\
  `level` int(11) DEFAULT NULL,\
  `entry_id` int(11) NOT NULL AUTO_INCREMENT,\
  PRIMARY KEY (`entry_id`)\
) ENGINE=InnoDB AUTO_INCREMENT=190 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;\
\
\pard\pardeftab720\partightenfactor0
\cf2 \cb3 \expnd0\expndtw0\kerning0
-- test database\cf0 \cb1 \kerning1\expnd0\expndtw0 \
\pard\pardeftab720\partightenfactor0
\cf9 \cb3 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec10 CREATE\cf9 \strokec11  \cf9 \strokec10 DATABASE\cf9 \strokec11  \cf9 \strokec12 IF\cf9 \strokec11  \cf9 \strokec10 NOT\cf9 \strokec11  \cf9 \strokec10 EXISTS\cf9 \strokec11  \cf9 \strokec13 `memory_game_webdev_db_test`\cf9 \strokec11  \cf9 \strokec14 /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */\cf9 \strokec11 ;\
\
\cf9 \strokec10 USE\cf9 \strokec11  \cf9 \strokec13 `memory_game_webdev_db_test`\cf9 \strokec11 ;\
\
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0
\cf0 \cb1 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 -- memory_game_webdev_db_test.Scores definition\cf9 \cb3 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec11 \
\pard\pardeftab720\partightenfactor0
\cf9 \strokec10 CREATE\cf9 \strokec11  \cf9 \strokec10 TABLE\cf9 \strokec11  `\cf9 \strokec12 Scores\cf9 \strokec11 ` (\
  \cf9 \strokec13 `user_id`\cf9 \strokec11  \cf9 \strokec10 varchar\cf9 \strokec11 (\cf9 \strokec15 255\cf9 \strokec11 ) \cf9 \strokec10 NOT NULL\cf9 \strokec11 ,\
  \cf9 \strokec13 `score`\cf9 \strokec11  \cf9 \strokec10 int\cf9 \strokec11 (\cf9 \strokec15 11\cf9 \strokec11 ) \cf9 \strokec10 DEFAULT\cf9 \strokec11  \cf9 \strokec10 NULL\cf9 \strokec11 ,\
  \cf9 \strokec13 `level`\cf9 \strokec11  \cf9 \strokec10 int\cf9 \strokec11 (\cf9 \strokec15 11\cf9 \strokec11 ) \cf9 \strokec10 DEFAULT\cf9 \strokec11  \cf9 \strokec10 NULL\cf9 \strokec11 ,\
  \cf9 \strokec13 `entry_id`\cf9 \strokec11  \cf9 \strokec10 int\cf9 \strokec11 (\cf9 \strokec15 11\cf9 \strokec11 ) \cf9 \strokec10 NOT NULL\cf9 \strokec11  AUTO_INCREMENT,\
  \cf9 \strokec10 PRIMARY KEY\cf9 \strokec11  (\cf9 \strokec13 `entry_id`\cf9 \strokec11 )\
) ENGINE\cf9 \strokec16 =\cf9 \strokec11 InnoDB AUTO_INCREMENT\cf9 \strokec16 =\cf9 \strokec15 190\cf9 \strokec11  \cf9 \strokec10 DEFAULT\cf9 \strokec11  CHARSET\cf9 \strokec16 =\cf9 \strokec11 utf8mb4 \cf9 \strokec10 COLLATE\cf9 \strokec16 =\cf9 \strokec11 utf8mb4_general_ci;\
}