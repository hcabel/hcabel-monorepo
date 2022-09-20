varying vec2 vUv;
varying vec3 vPos;
varying vec2 vObjec;

uniform sampler2D tHeightMap;
uniform vec2 vOffset;

void main()
{
	vec4 heightMap = texture2D(tHeightMap, (vPos.xz / 5.0) + vOffset);
	gl_FragColor = vec4(heightMap.rgb, 1.0);
}