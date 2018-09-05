<?
	
/***********************************************************************************************************************************************
+ VIMEO TO ROKU FEED:
+
+ file lives at https://xxx.com/vidFeed/vim.php
+ must refresh feed in Roku admin area: Dev Dashboard > Manage My Channels > Preview & Update > Feed Status > Refresh Now
+ use https://xxxx.com/vidFeed/index.php to see raw feed from Vimeo
+ Direct Publisher feed spec: https://github.com/rokudev/feed-specifications/blob/master/direct-publisher-feed-specification.md#shortformvideo
+
***********************************************************************************************************************************************/

	require("vimeo.php-1.2.5/autoload.php");

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);
	date_default_timezone_set("America/New_York");

	$client_id = "xxxxx";
	$client_secret = "xxxxx";
	$token = "xxxxx";
	
	$lib = new \Vimeo\Vimeo($client_id, $client_secret, $token);
	
	$search_results = $lib->request('/me/videos', array('per_page' => 100), 'GET');

	$data = $search_results['body']['data']; 
	$rokuFeed =  [
		 'providerName' =>'SmartPak Equine',
		 'lastUpdated' => date("c"),
		 'language' => 'en',
		 'shortFormVideos' => [],
		 'categories' => [	[ 'name'=>'If Horses Were People',
		 					  'query'=>'ihwp',
		 					  'order'=>'most_recent'
		 					],
		 					[ 'name'=>'Stuff Riders Say',
		 					  'query'=>'srs',
		 					  'order'=>'most_recent'
		 					],
		 					[ 'name'=>'Ask The Vet',
		 					  'query'=>'ask the vet',
		 					  'order'=>'most_recent'
		 					],
		 					[ 'name'=>'Short Segment',
		 					  'query'=>'short segment',
		 					  'order'=>'most_recent'
		 					],

		 					[ 'name'=>'Ask a Non-Rider',
		 					  'query'=>'aanr',
		 					  'order'=>'most_recent'
		 					],
		 					[ 'name'=>'How To',
		 					  'query'=>'how to',
		 					  'order'=>'most_recent'
		 					],
		 					[ 'name'=>'Product Showcases',
		 					  'query'=>'product',
		 					  'order'=>'most_recent'
		 					],
		 					[ 'name'=>'Product Reviews',
		 					  'query'=>'review',
		 					  'order'=>'most_recent'
		 					],
		 					[ 'name'=>'Piper By SmartPak',
		 					  'query'=>'piper',
		 					  'order'=>'most_recent'
		 					],
		 					[ 'name'=>'Featured',
		 					  'query'=>'featured',
		 					  'order'=>'most_recent'
		 					],
		 					[ 'name'=>'SmartPaks',
		 					  'query'=>'smartpaks',
		 					  'order'=>'most_recent'
		 					],
		 					[ 'name'=>'Tack Hauls',
		 					  'query'=>'tack haul',
		 					  'order'=>'most_recent'
		 					],
		 					[ 'name'=>'ColiCare',
		 					  'query'=>'colicare',
		 					  'order'=>'most_recent'
		 					],
		 					[ 'name'=>'Hoof Health',
		 					  'query'=>'hoof health',
		 					  'order'=>'most_recent'
		 					],
		 					[ 'name'=>'Team SmartPak',
		 					  'query'=>'sponsored riders',
		 					  'order'=>'most_recent'
		 					]
		 				 ]
     ];

	$shortFormVideos = [];
	for($i=0; $i < count($data); $i++){ 
	    $tempObj = []; 
	    $item = $data[$i];
	   	$tempObj['id'] = substr($item['uri'], strrpos($item['uri'], '/')+1);
	    $tempObj['title'] = $item['name'];
	    $tempObj['thumbnail'] = $item['pictures']['sizes'][count($item['pictures']['sizes'])-1]['link'];
	    $tempObj['shortDescription'] = ($item['description'] != null) ? substr($item['description'], 0,199) : 'Another great SmartPak video!';
	    $tempObj['longDescription'] =  ($item['description'] != null) ? $item['description'] : 'Another great SmartPak video!';
	    $tempObj['releaseDate'] = substr($item['release_time'], 0, strrpos($item['release_time'], 'T'));
	    $tempObj['tags'] = stringTags($item);
	    $tempObj['content'] = buildContentObject($item);

	    $shortFormVideos[] = $tempObj;
	}
	$rokuFeed['shortFormVideos'] = $shortFormVideos;

	

	function stringTags($item){
	    $tagstr = [];
	    for($j=0; $j < count($item['tags']); $j++){  
	        $tagstr[] = $item['tags'][$j]['tag']; 
	    }
	    if(count($tagstr) < 1){
	    	$tagstr[] = 'featured';
	    }
	    return $tagstr;
	};

	function buildContentObject($item){ 
	    $content = [];
	    $vids = $item['files'];
	    $content['dateAdded'] = $vids[0]['created_time'];
	    $content['duration'] = $item['duration'];
	    $content['videos'] = buildVideosObject($vids);
	    return $content;
	}

	function buildVideosObject($vids){
	    $videos = []; 
	    for($j = 0; $j < count($vids); $j++){
	    	$qual = getQuality($vids[$j]);
	    	if($qual == 'HD'){ 	    		
		        $vidObj = [];
		        $vidObj['url'] = str_replace("&", "&amp;", $vids[$j]['link_secure']);
		        $vidObj['quality'] = $qual;
		        $vidObj['videoType'] = 'MP4';
		        $videos[] = $vidObj;
	    		return $videos;
		    } 
		}
	}

	function getQuality($vid){
		$qual = $vid['quality'];
		$size = (isset($vid['height'])) ? $vid['height'] : '';
		$val = false;
		if($qual == 'hd' && $size == '720'){
			$val = 'HD';
		}else if($qual == 'hd' && $size == '1080'){
			$val = 'HD';
		}else if($qual == 'hls'){
			$val = 'HLS';
		}

		return $val;
	}

/*
print('<pre>');
print_r($search_results);
print_r($rokuFeed);
print('</pre>');

*/


	header('Content-Type: application/json');
	echo json_encode($rokuFeed);

?>

