import Style from '@styles/components/ProjectStats.module.scss';

import GithubIcon from '@Images/Github/GithubIcon.svg';
import ForkIcon from '@Images/Github/ForkIcon.svg';
import StarIcon from '@Images/Github/StarIcon.svg';
import { useEffect, useState } from 'react';

export interface IGithubStatsProps {
	repoUrl: string,
	hideStars?: boolean,
	hideForks?: boolean,
}

export default function GithubStats(props: IGithubStatsProps)
{
	const [_GithubStats, set_GithubStats] = useState<GithubResponce | undefined>(undefined);

	useEffect(() => {
		fetch(props.repoUrl)
			.then((response) => response.json())
			.then((data) => set_GithubStats(data));
	}, [props.repoUrl]);

	return (
		<div className={Style.StatContainer}>
			<GithubIcon />
			{_GithubStats &&
				<div className={Style.StatValues}>
					{!props.hideStars &&
						<div>
							<StarIcon className={Style.StatIcon} />
							<span className={Style.StatValue}>
								{_GithubStats.watchers.toLocaleString("en", {notation: "compact"})}
							</span>
							<span> stars</span>
						</div>
					}
					{!props.hideForks &&
						<div>
							<ForkIcon className={Style.StatIcon} />
							<span className={Style.StatValue}>
								{_GithubStats.forks.toLocaleString("en", {notation: "compact"})}
							</span>
							<span> forks</span>
						</div>
					}
				</div>
			}
		</div>
	);
}

/* Github interfaces *********************************************************/

export interface GithubResponce {
	id: number;
	node_id: string;
	name: string;
	full_name: string;
	private: boolean;
	owner: Owner;
	html_url: string;
	description: string;
	fork: boolean;
	url: string;
	forks_url: string;
	keys_url: string;
	collaborators_url: string;
	teams_url: string;
	hooks_url: string;
	issue_events_url: string;
	events_url: string;
	assignees_url: string;
	branches_url: string;
	tags_url: string;
	blobs_url: string;
	git_tags_url: string;
	git_refs_url: string;
	trees_url: string;
	statuses_url: string;
	languages_url: string;
	stargazers_url: string;
	contributors_url: string;
	subscribers_url: string;
	subscription_url: string;
	commits_url: string;
	git_commits_url: string;
	comments_url: string;
	issue_comment_url: string;
	contents_url: string;
	compare_url: string;
	merges_url: string;
	archive_url: string;
	downloads_url: string;
	issues_url: string;
	pulls_url: string;
	milestones_url: string;
	notifications_url: string;
	labels_url: string;
	releases_url: string;
	deployments_url: string;
	created_at: string;
	updated_at: string;
	pushed_at: string;
	git_url: string;
	ssh_url: string;
	clone_url: string;
	svn_url: string;
	homepage: string;
	size: number;
	stargazers_count: number;
	watchers_count: number;
	language: string;
	has_issues: boolean;
	has_projects: boolean;
	has_downloads: boolean;
	has_wiki: boolean;
	has_pages: boolean;
	forks_count: number;
	mirror_url: null;
	archived: boolean;
	disabled: boolean;
	open_issues_count: number;
	license: License;
	allow_forking: boolean;
	is_template: boolean;
	web_commit_signoff_required: boolean;
	topics: string[];
	visibility: string;
	forks: number;
	open_issues: number;
	watchers: number;
	default_branch: string;
	temp_clone_token: null;
	network_count: number;
	subscribers_count: number;
}

export interface License {
	key: string;
	name: string;
	spdx_id: string;
	url: string;
	node_id: string;
}

export interface Owner {
	login: string;
	id: number;
	node_id: string;
	avatar_url: string;
	gravatar_id: string;
	url: string;
	html_url: string;
	followers_url: string;
	following_url: string;
	gists_url: string;
	starred_url: string;
	subscriptions_url: string;
	organizations_url: string;
	repos_url: string;
	events_url: string;
	received_events_url: string;
	type: string;
	site_admin: boolean;
}
