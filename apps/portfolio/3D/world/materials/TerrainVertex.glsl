varying vec2 vUv;
varying vec3 vPos;

uniform sampler2D tHeightMap;
uniform vec2 vOffset;

void main()
{
	vUv = uv;
	vPos = position;

#if !defined(USE_COLOR) // Error no vertex color
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	return;
#endif

	vec4 heightMap = texture2D(tHeightMap, (vPos.xz / 5.0) + vOffset);

	vec3 vertexPosition = position;
	vertexPosition.y += heightMap.r * 0.25 * color.r;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPosition, 1.0);
}