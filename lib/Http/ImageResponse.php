<?php
namespace OCA\MemoPad\Http;

use OCP\AppFramework\Http\Response;
use OCP\AppFramework\Http;

class ImageResponse extends Response {
    private $data;

    public function __construct($data, $contentType = "image/png") {
        $this->addHeader('Content-Type', $contentType);
		$this->setStatus(Http::STATUS_OK);
        $this->data = $data;
    }

    public function render() {
        return $this->data;
    }

}
