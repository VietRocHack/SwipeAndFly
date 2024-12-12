# For internal use of video analysis only

import asyncio
import src.function.video_analysis.analyze_videos as video_analysis

def analyze_videos(video_urls, num_frames_to_sample=5, metadata_fields=["title"]):
    _, content = asyncio.run(video_analysis.analyze_from_urls(
		video_urls,
		num_frames_to_sample,
		metadata_fields=metadata_fields
	))

    return content
