<?php
namespace OCA\MemoPad\Service;

use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\IPreview;
use OCP\IRequest;
use OCP\AppFramework\ApiController;

use OCP\Files\Node;

/**
 * Provide preview data (as strings) for images
 */
class ImageService {
    private $userId;

	/** @var IPreview */
    private $previewManager;

    /** @var Folder */
    private $userFolder;

    /**
     * [__construct description]
     * @param string      $AppName
     * @param IRequest    $request
     * @param IRootFolder $rootFolder
     * @param IPreview    $previewManager
     * @param string      $UserId
     */
	public function __construct(
        $AppName,
        IRequest $request,
        IRootFolder $rootFolder,
        IPreview $previewManager,
        $UserId
    ){
		$this->userId = $UserId;
        $this->userFolder = $rootFolder->getUserFolder($this->userId);
        $this->previewManager = $previewManager;
	}

    /**
     * Return a list of paths to images the current user have
     * @return Node[] the list of paths to images
     */
    public function getImageFiles() {
        return $this->userFolder->searchByMime("image");
    }
}
