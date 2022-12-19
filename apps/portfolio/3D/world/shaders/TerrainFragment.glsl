varying vec3 vPos;

uniform vec3 boundingBoxMin;
uniform vec3 boundingBoxMax;

void main()
{
	// map bounding box to 0..1
	vec3 pos = (vPos - (boundingBoxMin)) / ((boundingBoxMax + 2.0) - (boundingBoxMin));
	float gradientOffset = 0.7;
	float gradienthardness = 0.3;
	float gradientValue = smoothstep(gradientOffset, gradientOffset + gradienthardness, pos.y);

	// mix blue and peach color based on height
	vec3 color = mix(
		vec3(29.0, 47.0, 150.0) / 255.0,
		vec3(204.0, 70.0, 90.0) / 255.0,
		clamp(gradientValue, 0.0, 1.0));


	vec3 fragment_color = color;