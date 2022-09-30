varying vec2 vUv;
varying vec3 vPos;
varying vec3 vNorm;

uniform sampler2D tHeightMap;
uniform vec2 vOffset;

void main()
{
	// Get texture height map
	vec4 heightMap = texture2D(tHeightMap, (vPos.xz / 10.0) + vOffset);

	float grad = heightMap.r * 2.0 - 0.25;
	grad = clamp(grad, 0.0, 1.0);

	// mix blue and peach color based on height
	vec3 color = mix(
		vec3(29.0, 47.0, 150.0) / 255.0,
		clamp((vec3(204.0, 70.0, 90.0) / 255.0), 0.0, 1.0),
		grad);


	vec3 fragment_color = mix(
		vec3(204.0, 70.0, 90.0) / 255.0,
		vec3(29.0, 47.0, 150.0) / 255.0,
		clamp(vUv.y + 0.65, 0.0, 1.0));

	// if on top of the cube (using normal)
	if ((vNorm.x < 0.1 && vNorm.y < 0.1 && vNorm.z < 0.1) == false
		&& (vNorm.x < 0.1 && vNorm.y < 0.1 && vNorm.z > 0.9) == false)
	{
		fragment_color = mix(
			vec3(29.0, 47.0, 150.0) / 255.0,
			vec3(204.0, 70.0, 90.0) / 255.0,
			grad);
	}

	// vec3 fragment_color = vNorm;