<?php

list($width, $height, $type, $attr) = getimagesize("image_name.jpg");

echo "Image width " .$width;
echo "<BR>";
echo "Image height " .$height;
echo "<BR>";
echo "Image type " .$type;
echo "<BR>";
echo "Attribute " .$attr;

?>