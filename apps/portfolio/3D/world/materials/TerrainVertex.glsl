varying vec2 vUv;
varying vec3 vPos;
varying vec3 vNorm;

uniform sampler2D tHeightMap;
uniform vec2 vOffset;

vec3 orthogonal(vec3 v)
{
	return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0) : vec3(0.0, -v.z, v.y));
}

vec3 displace(vec3 point)
{
	vec2 textureCoord = (point.xz / 10.0) + vOffset;
	vec4 heightMap = texture2D(tHeightMap, textureCoord);
	vec3 displacementValue = vec3(0.0, heightMap.r * 1.0 * color.r, 0.0);
	return displacementValue;
}

void main()
{
	vUv = uv;
	vPos = position;
	vNorm = normal;

	vec3 displacedValue = displace(position);
	vec3 displacedPosition = position + displacedValue;


	float offset = 0.5;
	vec3 tangent = orthogonal(normal);
	vec3 bitangent = normalize(cross(normal, tangent));
	vec3 neighbour1 = position + tangent * offset;
	vec3 neighbour2 = position + bitangent * offset;
	vec3 displacedNeighbour1 = neighbour1 + displace(neighbour1);
	vec3 displacedNeighbour2 = neighbour2 + displace(neighbour2);

	// https://i.ya-webdesign.com/images/vector-normals-tangent-16.png
	vec3 displacedTangent = displacedNeighbour1 - displacedPosition;
	vec3 displacedBitangent = displacedNeighbour2 - displacedPosition;

	// https://upload.wikimedia.org/wikipedia/commons/d/d2/Right_hand_rule_cross_product.svg
	vec3 displacedNormal = normalize(cross(displacedTangent, displacedBitangent));
	vNorm = displacedNormal;

