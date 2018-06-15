<?php
namespace OCA\MemoPad\Service;

use OCA\MemoPad\Service\ServiceException;
use OCP\IPreview;

/**
 * A service to obtain data of a preview file (in string), given a File
 */
class PreviewService {
    private $previewManager;

    public function __construct(
        IPreview $previewManager
    ) {
		$this->previewManager = $previewManager;
	}

    /**
     * Return the content data of the preview.
     * @param  \OCP\Files\Node $node  Node to generate preview
     * @param  int $width  width
     * @param  int $height height
     * @return string the content of the previe
     */
    public function getPreviewData($node, $width, $height) {
        if (!$this->previewManager->isAvailable($node)) {
            throw new ServiceException();
        }

        return $this->previewManager->
            getPreview($node, $width, $height, false, IPreview::MODE_FILL, null)->getContent();
    }
}
