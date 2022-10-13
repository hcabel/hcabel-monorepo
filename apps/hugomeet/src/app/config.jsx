/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   config.jsx                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: hcabel <hcabel@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/11/19 22:49:04 by hcabel            #+#    #+#             */
/*   Updated: 2022/02/28 16:42:59 by hcabel           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

function GetEnv(key)
{
	const val = process.env[key];
	if (!val) {
		throw new Error(`ENV ${key} is not valid`);
	}
	return (val);
}

console.log(process.env)

const config = {
	url_front: GetEnv("NX_HUGOMEET_ENDPOINT"),
	url_signaling: GetEnv("NX_HUGOMEET_SS_ENDPOINT")
};

export default config;
